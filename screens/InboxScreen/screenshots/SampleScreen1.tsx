import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';

export default function EntryScreen1() {
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView edges={['top']}>
          <AssetBlockImage source={require('../../../assets/screenshot-entry1.png')} />
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView style={{ backgroundColor: 'white', position: 'relative' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/screenshot-tabs1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '50%' }} toScreenName="Entry2" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
