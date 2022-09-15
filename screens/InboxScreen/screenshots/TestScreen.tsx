import { StatusBar } from 'expo-status-bar';
import { ScrollView,View, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AssetBlockImage from '../../../components/AssetBlockImage';
import Hotspot from '../../../components/Hotspot';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { sendbird } from '../../../utils/sendbird'



export default async function TestScreen() {
  // const navigation = useNavigation<NavigationProp<any>>();
  // const channelUrl = getChannelByCustomType();
  // console.log ("Final return: ", channelUrl);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{  flex: 1 }}>
          <AssetBlockImage source={require('../../../assets/Landing.png')} />
        </View>
       </SafeAreaView>
        <View style ={{ flex: 2.5}}>
          <ScrollView>
          <AssetBlockImage source={require('../../../assets/Container.png')} />
          <Hotspot style={{ position: 'absolute', width: '100%', height: '100%' }} toScreenName = "Entry3" />
          </ScrollView>        
        </View>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../../../assets/BottomNav1.png')} />
        {/* <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} onPress = {() => navigation.navigate('Chat',{ channelUrl })} debug /> */}
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} toScreenName="Settings" />
      </SafeAreaView>
    </View>
  );

   function getChannelByCustomType() {
      const listQuery = sendbird.GroupChannel.createMyGroupChannelListQuery();
      listQuery.includeEmpty = true;
      listQuery.customTypesFilter = ['coach'];
    
      if(listQuery.hasNext){
        listQuery.next((groupChannels, error) => {
          if (error) {
            return (error);
          }
          console.log("getChannelByCustomType - filter: ",groupChannels);
          const channelurl= groupChannels[0].url;
          console.log("getChannelByCustomType with URL: ",channelurl);
          return channelurl;
          
       });
     }
  }
}
