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


export default function PayEntryScreen5() {
  {/* Account Details */ }
  const navigation = useNavigation<NavigationProp<any>>();
  const [SupportChannelUrl, setSupportChannelUrl] = useState('');

  //Navigate to Chat and Call Screen
  useEffect(() => {
    getChannelUrlByCustomType('support').then((channelUrl) => setSupportChannelUrl(channelUrl));
  }, []);


  const { startCall } = useContext(CallContext);
  const [calleeUser, setCalleeUser] = useState<SendBird.User | null>(null);

  useEffect(() => {
    async function loadCallee() {
      const supportbot = await getCallee(botUserIds.supportBot);
      setCalleeUser(supportbot);
    }

    loadCallee();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/PaymentTransactions.png')} />
          <Hotspot style={{ position: 'absolute', width: '15%', height: '7%', left: '65%', right: '30%', top: '75%' }} onPress={() => {
            navigation.navigate('Chat', { channelUrl: SupportChannelUrl });
          }} />
          <Hotspot
            style={{ position: 'absolute', width: '15%', height: '7%', left: '82%', right: '10%', top: '75%' }}
            onPress={() => {
              if (calleeUser) {
                startCall({ user: calleeUser });
              }
            }}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', top: '0%', left: 0 }} toScreenName="PayEntryScreen2" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%', top: '0%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
