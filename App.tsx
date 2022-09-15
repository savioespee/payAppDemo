import AsyncStorage from '@react-native-async-storage/async-storage';
import Chance from 'chance';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Platform, UIManager, View } from 'react-native';
import { NotifierWrapper } from 'react-native-notifier';
import { QueryClient, QueryClientProvider } from 'react-query';

import resetUser from './api/resetUser';
import AppSkeleton from './components/AppSkeleton';
import {
  asyncStorageKeys,
  DEFAULT_FEMALE_PROFILE_URL,
  DEFAULT_MALE_PROFILE_URL,
  USER_METADATA_KEYS,
  USER_VERSION,
} from './constants';
import { scenario } from './constants/scenario';
import { AuthContext } from './contexts';
import RootScreenScreenshots from './screens/RootScreen.Screenshots';
import RootScreenStack from './screens/RootScreen.Stack';
import RootScreenTab from './screens/RootScreen.Tab';
import alert from './utils/alert';
import { registerPushToken, sendbird } from './utils/sendbird';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const chance = new Chance();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });

enum RootScreenTypes {
  Tabs,
  Stack,
  Screenshots,
}

const ROOT_SCREEN_TYPE: RootScreenTypes = RootScreenTypes.Screenshots;

async function connectToSendBird({
  username,
  nickname,
  gender,
}: {
  username: string;
  nickname: string;
  gender?: 'male' | 'female';
}) {
  await sendbird.connect(username);

  const user = await sendbird.updateCurrentUserInfo(
    nickname,
    gender === 'female' ? DEFAULT_FEMALE_PROFILE_URL : DEFAULT_MALE_PROFILE_URL,
  );

  await registerPushToken();

  console.log('connected to sendbird');
  return user;
}

async function getUserFromAsyncStorage() {
  try {
    const user = await AsyncStorage.getItem(asyncStorageKeys.savedUser);
    return user && JSON.parse(user);
  } catch {
    return null;
  }
}

async function saveUserToAsyncStorage(user) {
  try {
    if (user == null) {
      await AsyncStorage.removeItem(asyncStorageKeys.savedUser);
    } else {
      await AsyncStorage.setItem(asyncStorageKeys.savedUser, JSON.stringify(user));
    }
  } catch {
    // ignore
  }
}

const deepCopy = (obj: Record<string, any>) => JSON.parse(JSON.stringify(obj));

export default function App() {
  const [currentUser, setCurrentUser] = useState<SendBird.User | null>(null);
  const [isInitialUserLoaded, setInitialUserLoaded] = useState(false);
  const [isInitializingUser, setIsInitializingUser] = useState(false);

  const isAppReady = isInitialUserLoaded;

  const updateCurrentUserState = useCallback(async () => {
    const user = sendbird.currentUser;
    await saveUserToAsyncStorage(user);
    setCurrentUser(deepCopy(user));
  }, []);

  const initializeCurrentUser = useCallback(async () => {
    setIsInitializingUser(true);

    const userId = sendbird.currentUser.userId;
    const nickname = sendbird.currentUser.nickname;
    try {
      await sendbird.disconnect();
      queryClient.clear();
      await resetUser(userId);
      await connectToSendBird({
        username: userId,
        nickname: scenario.userProfile.nickname,
      });
      await updateCurrentUserState();

      setIsInitializingUser(false);
    } catch (error) {
      console.error(error);
      alert('Initialization failed.');
      await sendbird.disconnect();
      await connectToSendBird({ username: userId, nickname });
      await updateCurrentUserState();
    } finally {
      setIsInitializingUser(false);
    }
  }, [updateCurrentUserState]);

  const setUpNewUser = useCallback(async () => {
    setIsInitializingUser(true);
    try {
      // create a new user and sign in
      const userId = chance.guid();
      await connectToSendBird({
        username: userId,
        nickname: scenario.userProfile.nickname,
        gender: 'male',
      });

      // initialize user
      await resetUser(userId);
      await updateCurrentUserState();
    } catch (error) {
      console.error(error);
    } finally {
      setIsInitializingUser(false);
    }
  }, [updateCurrentUserState]);

  const authContext = useMemo(() => {
    return {
      currentUser,
      isInitializingUser,
      updateCurrentUserState,
      setIsInitializingUser,
      initializeCurrentUser,
      setUpNewUser,
    };
  }, [currentUser, initializeCurrentUser, isInitializingUser, setUpNewUser, updateCurrentUserState]);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        const user = await getUserFromAsyncStorage();

        if (user) {
          setCurrentUser(user);
          if (!sendbird.currentUser) {
            const latestUser = await connectToSendBird({
              username: user.userId,
              nickname: user.nickname,
            });
            setCurrentUser(latestUser);

            if (latestUser.metaData[USER_METADATA_KEYS.initializedVersion] !== USER_VERSION) {
              await initializeCurrentUser();
            }
          }
        } else {
          await setUpNewUser();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setInitialUserLoaded(true);
      }
    }
    prepare();
  }, [initializeCurrentUser, setUpNewUser, updateCurrentUserState]);

  useEffect(() => {
    const handleStateChange = (newState) => {
      if (newState === 'active') {
        sendbird.setForegroundState();
      } else {
        sendbird.setBackgroundState();
      }
    };

    const appStateListener = AppState.addEventListener('change', handleStateChange);

    return () => {
      appStateListener.remove();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady || isInitializingUser) {
    return <AppSkeleton />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NotifierWrapper>
        <AuthContext.Provider value={authContext}>
          {ROOT_SCREEN_TYPE === RootScreenTypes.Tabs && <RootScreenTab />}
          {ROOT_SCREEN_TYPE === RootScreenTypes.Stack && <RootScreenStack />}
          {ROOT_SCREEN_TYPE === RootScreenTypes.Screenshots && <RootScreenScreenshots />}
          <View onLayout={onLayoutRootView} />
        </AuthContext.Provider>
      </NotifierWrapper>
    </QueryClientProvider>
  );
}
