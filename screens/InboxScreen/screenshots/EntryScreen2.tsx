import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { ScrollView,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';
import { AuthContext } from '../../../contexts';

export default function EntryScreen2() {

  const { currentUser, initializeCurrentUser } = useContext(AuthContext);

  if (!currentUser) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{  flex: 1 }}>
          <AssetBlockImage source={require('../../../assets/Landing.png')} />
          <Hotspot style={{ position: 'absolute', width: '20%', height: '20%', right: '85%' }} onPress={initializeCurrentUser}/>
        </View>
       </SafeAreaView>
        <View style ={{ flex: 2}}>
          <ScrollView>
          <AssetBlockImage source={require('../../../assets/Container.png')} />
          <Hotspot style={{ position: 'absolute', width: '100%', height: '100%' }} toScreenName="Entry3" />
          </ScrollView>        
        </View>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} toScreenName="Entry1"  />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '25%' }} toScreenName="Entry7"/>
      </SafeAreaView>
    </View>
  );
}