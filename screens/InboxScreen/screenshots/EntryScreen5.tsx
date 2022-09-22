import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';
import styles from '../../../styles';
import Spinner from 'react-native-loading-spinner-overlay'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function EntryScreen5() {

  const navigation = useNavigation<NavigationProp<any>>();
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Entry6');
    }, 3000);
  };

  return (
    <View style={{ flex: 1 }}>
       <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
        />
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/Pay.png')} />
          {/* <Hotspot style={{ position: 'absolute', width: '100%', height: '20%', top: '75%' }} toScreenName="Entry6" debug/> */}
          <Hotspot style={{ position: 'absolute', width: '30%', height: '10%', right: '80%' }} toScreenName="Entry4"/>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: 'white' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav5.png')} />
        <Hotspot style={{ position: 'absolute', width: '100%', height: '50%', left: 0 }} onPressOverlayOpacity={0.1} onPress={startLoading}  />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: 0, top: "55%" }} toScreenName="Entry1"  />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: '25%', top: "55%" }} toScreenName="Entry7"  />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '45%', left: '75%', top:'55%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
