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

export default function PayEntryScreen5() {
  {/* Account Details */ }

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
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ position: 'relative' }}>
          <AssetBlockImage source={require('../../../assets/PaymentInsight.png')} />

          <Hotspot style={{ position: 'absolute', width: '25%', height: '5%' }} toScreenName="PayEntryScreen2" />{/* Back */}
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: 'white' }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', top: '0%', left: 0 }} toScreenName="PayEntryScreen2" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%', top: '0%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );
}
