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
import HomeScreen from './HomeScreen';
import InboxScreen from './InboxScreen';
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
                <Stack.Screen name="Home" component={HomeScreen} />
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
