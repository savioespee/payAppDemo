import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';

export default function EntryScreen1() {
  return (
    <View style={{ flex: 1}}>
      <StatusBar style="dark" />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', position: 'relative' }} edges={['top']}>
          <AssetBlockImage source={require('../../../assets/GetStarted.png')} />
          {/* <Hotspot style={{ position: 'absolute', width: '80%', height: '10%', left: '10%', top: '100%' }} toScreenName="Entry2" debug/> */}
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView style={{ backgroundColor: 'white', position: 'relative' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav2.png')} />
        <Hotspot style={{ position: 'absolute', width: '100%', height: '40%' }} toScreenName="Entry2" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: '75%', top:"55%" }} toScreenName="Settings" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: '25%', top:"55%" }} toScreenName="Entry7" />
      </SafeAreaView>
    </View>
  );
}
