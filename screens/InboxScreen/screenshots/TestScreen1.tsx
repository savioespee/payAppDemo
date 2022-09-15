import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Pressable, Text, SafeAreaView,  } from 'react-native';

export default function TestScreen1() {
  const navigation = useNavigation<NavigationProp<any>>();
  const channelUrl = "sendbird_group_channel_214296292_b1444007faec3a8b2935f285055bb7d397398b4c"
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
    <View>
      <Pressable onPress={() => navigation.navigate('Chat',{ channelUrl } )}>
        <Text>Press me!</Text>
      </Pressable>
    </View>
    </SafeAreaView>
  );
}