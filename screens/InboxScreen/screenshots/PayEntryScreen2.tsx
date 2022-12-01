import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';
import { AuthContext } from '../../../contexts';

export default function PayEntryScreen2() {
  {/* Get Started */ }

  const { currentUser, initializeCurrentUser } = useContext(AuthContext);

  if (!currentUser) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {/*<ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', position: 'relative' }} edges={['top']}>
          <AssetBlockImage source={require('../../../assets/LandingPayments.png')} />
        </SafeAreaView>
      </ScrollView> */}

      <View style={{ flex: 1 }}>
        <ScrollView>
          <AssetBlockImage source={require('../../../assets/PaymentActivity2.png')} />
          <Hotspot style={{ position: 'absolute', width: '30%', height: '8%', left: '3%', top: '22.5%' }} toScreenName="PayEntryScreen3" />{/* Send modey */}
          <Hotspot style={{ position: 'absolute', width: '30%', height: '8%', left: '35%', top: '22.5%' }} toScreenName="PayEntryScreen5" />{/* My Transactions */}
          <Hotspot style={{ position: 'absolute', width: '30%', height: '8%', left: '67%', top: '22.5%' }} toScreenName="PayEntryScreen6" />{/* Insights */}
        </ScrollView>
      </View>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} toScreenName="PayEntryScreen1" />{/* Home - Get Started */}
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings" />{/* Profile Settings */}
      </SafeAreaView>
    </View>
  );
}