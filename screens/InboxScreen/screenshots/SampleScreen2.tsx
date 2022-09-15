import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';

export default function EntryScreen2() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/screenshot-entry2.png')} />
          <Hotspot style={{ position: 'absolute', width: '100%', height: '8%', top: '75%' }} toScreenName="Inbox" />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/screenshot-tabs2.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} toScreenName="Entry1" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
