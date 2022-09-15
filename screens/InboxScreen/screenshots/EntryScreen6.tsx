import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';

export default function EntryScreen6() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/Payment.png')} />
          <Hotspot style={{ position: 'absolute', width: '100%', height: '20%', top: '60%' }} toScreenName="Entry7" />
          <Hotspot style={{ position: 'absolute', width: '30%', height: '10%', right: '80%' }} toScreenName="Entry5" />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: 'white' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNavPayment.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} toScreenName="Entry1" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '25%' }} toScreenName="Entry7"  />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings"  />
      </SafeAreaView>
    </View>
  );
}
