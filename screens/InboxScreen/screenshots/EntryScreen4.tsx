import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';

export default function EntryScreen4() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/PlaceOrder.png')} />
          <Hotspot style={{ position: 'absolute', width: '100%', height: '20%', top: '75%' }} toScreenName="Entry5"/>
          <Hotspot style={{ position: 'absolute', width: '30%', height: '10%', right: '80%' }} toScreenName="Entry3"/>
        </View>
      </SafeAreaView>
      </ScrollView>
      <SafeAreaView style={{ backgroundColor: 'white' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav4.png')} />
        <Hotspot style={{ position: 'absolute', width: '100%', height: '50%', left: 0 }} toScreenName="Entry5" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: 0, top: "55%" }} toScreenName="Entry1"  />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: '25%', top: "55%" }} toScreenName="Entry7" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: '75%', top: "55%" }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
