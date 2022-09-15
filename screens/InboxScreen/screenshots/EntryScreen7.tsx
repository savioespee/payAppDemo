import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';
import { botUserIds } from '../../../constants/botUsers';
import { CallContext } from '../../../contexts';
import getCallee from '../../../utils/getCallee';
import getChannelUrlByCustomType from '../../../utils/getChannelUrlByCustomType';
import { sendbird } from '../../../utils/sendbird';


export default function EntryScreen7() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [deliveryDriverChannelUrl, setdeliveryDriverChannelUrl] = useState('');

  //Navigate to Chat and Call Screen
  useEffect(() => {
    getChannelUrlByCustomType('fooddelivery').then((channelUrl) => setdeliveryDriverChannelUrl(channelUrl));
  }, []);

  const { toggleCallScreen } = useContext(CallContext);
  const [calleeUser, setCalleeUser] = useState<SendBird.User | null>(null);

  useEffect(() => {
    // getCallee('botUserIds.casey').then((callee) => setCalleeUser(callee));
    async function getCallee() {
      const userListQuery = sendbird.createApplicationUserListQuery();
      userListQuery.userIdsFilter = [botUserIds.casey];
      userListQuery.limit = 1;
      const [user] = await userListQuery.next();
      setCalleeUser(user);
    }

    getCallee();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/YourOrder.png')} />
          <Hotspot style={{ position: 'absolute', width: '20%', height: '20%', top: '68%', left: '52%' }} onPress={() => {
            navigation.navigate('Chat', { channelUrl: deliveryDriverChannelUrl });
          }} />
          <Hotspot
            style={{ position: 'absolute', width: '20%', height: '20%', top: '68%', right: '4%' }}
            onPress={() => {
              if (calleeUser) {
                toggleCallScreen({ user: calleeUser });
              }
            }}
            
          />
          <Hotspot style={{ position: 'absolute', width: '30%', height: '10%', right: '80%' }} toScreenName="Entry6"/>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNavYourOrder.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} toScreenName="Entry1" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '25%' }} toScreenName="Entry7" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
