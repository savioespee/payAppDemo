import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import SendBird from 'sendbird';

import { APP_ID } from '../constants';

export const sendbird = new SendBird({ appId: APP_ID });
sendbird.useAsyncStorageAsDatabase(AsyncStorage);

export async function registerPushToken() {
  if (!Device.isDevice) {
    return;
  }

  // const authorizationStatus = await messaging().requestPermission();
  // if (
  //   authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  // ) {
  //   if (Platform.OS === 'ios') {
  //     const token = await messaging().getAPNSToken();
  //     if (token) {
  //       sendbird.registerAPNSPushTokenForCurrentUser(token);
  //     }
  //   } else {
  //     const token = await messaging().getToken();
  //     if (token) {
  //       sendbird.registerGCMPushTokenForCurrentUser(token);
  //     }
  //   }
  // }
}

export const unregisterPushToken = async () => {
  // const token = await messaging().getToken();
  // if (Platform.OS === 'ios') {
  //   const apnsToken = await messaging().ios.getAPNSToken();
  //   if (!apnsToken) {
  //     return;
  //   }
  //   sendbird.unregisterAPNSPushTokenForCurrentUser(apnsToken);
  // } else {
  //   sendbird.unregisterGCMPushTokenForCurrentUser(token);
  // }
};
