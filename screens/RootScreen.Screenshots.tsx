import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

import CallScreen from '../components/CallScreen';
import theme from '../constants/theme';
import { AuthContext, CallContext, ShareModalContext } from '../contexts';
import useCallScreen from '../hooks/useCallScreen';
import ChatScreen from './ChatScreen';
import InboxScreen from './InboxScreen';

import EntryScreen1 from './InboxScreen/screenshots/EntryScreen1';
import EntryScreen2 from './InboxScreen/screenshots/EntryScreen2';
import EntryScreen3 from './InboxScreen/screenshots/EntryScreen3';
import EntryScreen4 from './InboxScreen/screenshots/EntryScreen4';
import EntryScreen5 from './InboxScreen/screenshots/EntryScreen5';
import EntryScreen6 from './InboxScreen/screenshots/EntryScreen6';
import EntryScreen7 from './InboxScreen/screenshots/EntryScreen7';
import TestScreen1 from './InboxScreen/screenshots/TestScreen1';
import NewEntryScreen1 from './InboxScreen/screenshots/NewEntryScreen1';

import NewConversationScreen from './NewConversationScreen';
import SettingsScreen from './SettingsScreen';

const Stack = createNativeStackNavigator();

export default function RootScreen() {
  const { currentUser } = useContext(AuthContext);
  const { callScreenData, callContext, stopCall } = useCallScreen();

  const isSignedIn = !!currentUser;
  const [shareModalState, setShareModalState] = useState({
    title: '',
    isVisible: false,
    shareTargets: [],
    onSelect: () => {},
  });

  const shareModalContext = useMemo(() => {
    const modalProps = {
      title: shareModalState.title,
      isVisible: shareModalState.isVisible,
      setIsVisible: (isVisible) => {
        setShareModalState((state) => ({ ...state, isVisible }));
      },
      shareTargets: shareModalState.shareTargets,
      onSelect: shareModalState.onSelect,
    };
    return { modalProps, setShareModalState };
  }, [shareModalState.title, shareModalState.isVisible, shareModalState.shareTargets, shareModalState.onSelect]);

  return (
    <CallContext.Provider value={callContext}>
      <StatusBar style="inverted" />
      <ShareModalContext.Provider value={shareModalContext}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitleStyle: { color: '#444444' },
              headerTintColor: theme.navigationTintColor,
            }}
          >
            {isSignedIn && (
              <>
                <Stack.Group screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
                  <Stack.Screen name="Entry1" component={EntryScreen1} />
                  <Stack.Screen name="Entry2" component={EntryScreen2} />
                  <Stack.Screen name="Entry3" component={EntryScreen3} />
                  <Stack.Screen name="Entry4" component={EntryScreen4} />
                  <Stack.Screen name="Entry5" component={EntryScreen5} />
                  <Stack.Screen name="Entry6" component={EntryScreen6} />
                  <Stack.Screen name="Entry7" component={EntryScreen7} />
                  <Stack.Screen name="NewEntryScreen1" component={NewEntryScreen1} />
                  <Stack.Screen name="TS1" component={TestScreen1}/>
                </Stack.Group>
                <Stack.Screen name="Inbox" component={InboxScreen} />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{
                    headerBackTitleVisible: false,
                    headerShadowVisible: true,
                    headerTitle: () => <View />,
                  }}
                />
                <Stack.Screen name="NewConversation" component={NewConversationScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <ReactNativeModal
          isVisible={!!callScreenData}
          animationIn="fadeIn"
          style={{ justifyContent: 'flex-end', margin: 0 }}
        >
          {callScreenData ? <CallScreen data={callScreenData} onClose={stopCall} /> : <View />}
        </ReactNativeModal>
      </ShareModalContext.Provider>
    </CallContext.Provider>
  );
}
