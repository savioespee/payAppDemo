import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AssetBlockImage from '../components/AssetBlockImage';

import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Hotspot from '../components/Hotspot';
import Spacer from '../components/Spacer';
import Text from '../components/Text';
import { colors } from '../constants';
import { AuthContext } from '../contexts';
import styles from '../styles';
import getChannelUrlByCustomType from '../utils/getChannelUrlByCustomType';

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [SupportChannelUrl, setSupportChannelUrl] = useState('');

  useEffect(() => {
    getChannelUrlByCustomType('support').then((channelUrl) => setSupportChannelUrl(channelUrl));
  }, []);


  const { currentUser, initializeCurrentUser } = useContext(AuthContext);

  if (!currentUser) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.textBold, styles.textXLarge]}>Profile</Text>
        <Spacer size={16} />

        <View style={[styles.rowStack, { justifyContent: 'center' }]}>
          <Avatar
            size={60}
            user={currentUser}
            fallbackAvatarKey={currentUser.userId}
            style={{ backgroundColor: '#E2F8EB' }}
          />
          <Spacer size={16} />
          <View style={[styles.colStack, { alignItems: 'flex-start', flex: 1 }]}>
            <Text style={[styles.textBold, styles.textXLarge]}>{currentUser.nickname}</Text>
            {/* <Text style={[styles.textSmall, { color: colors.secondaryText }]}>{currentUser.userId}</Text> */}
            <Text style={[styles.textMedium, { color: colors.secondaryText }]}>Edit Profile</Text>
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <ScrollView>
            <AssetBlockImage source={require('../assets/Profile.png')} />
            <Hotspot style={{ position: 'absolute', width: '100%', height: '10%', top: '45%' }} onPress={() => {
              navigation.navigate('Chat', { channelUrl: SupportChannelUrl });
            }} />
          </ScrollView>
        </View>

        {/* <Spacer size={16} />
        <Button title="Reset" variant="secondary" onPress={initializeCurrentUser} />
        <Spacer size={32} /> */}
      </ScrollView>
      <SafeAreaView style={{ backgroundColor: 'white', borderTopColor: '#EEE', borderTopWidth: 1 }} edges={['bottom']}>
        <AssetBlockImage source={require('../assets/BottomNavSetting1.png')} />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: 0 }} toScreenName="PayEntryScreen2" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '25%' }} toScreenName="Entry7" />
        <Hotspot style={{ position: 'absolute', width: '25%', height: '100%', left: '75%' }} onPress={initializeCurrentUser} />
      </SafeAreaView>
    </View>
  );
}
