import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import getChannelUrlByCustomType from '../../../utils/getChannelUrlByCustomType';
import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';

export default function PayEntryScreen3() {
  {/* Send money - init*/ }
  const navigation = useNavigation<NavigationProp<any>>();
  const [friendsChannelUrl, setfriendsChannelUrl] = useState('');

  //Navigate to Chat and Call Screen
  useEffect(() => {
    getChannelUrlByCustomType('friends').then((channelUrl) => setfriendsChannelUrl(channelUrl));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ position: 'relative' }}>
            <AssetBlockImage source={require('../../../assets/PaymentInit2.png')} />
            <Hotspot style={{ position: 'absolute', width: '20%', height: '5%', left: '72%', right: '8%', top: '53%' }} toScreenName="PayEntryScreen4" />{/* Success */}
            <Hotspot style={{ position: 'absolute', width: '20%', height: '5%', left: '72%', right: '8%', top: '62%' }} onPress={() => {
              navigation.navigate('Chat', { channelUrl: friendsChannelUrl });
            }} />{/* Split */}

            {/* <AssetBlockImage source={require('../../../assets/PaymentInit.png')} /> 
            <Hotspot style={{ position: 'absolute', width: '48%', height: '8%', left: '26%', right: '80%', top: '85%' }} toScreenName="PayEntryScreen4" debug /> */}
          </View>
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView style={{ backgroundColor: 'white' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', top: '0%', left: 0 }} toScreenName="PayEntryScreen2" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%', top: '0%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
