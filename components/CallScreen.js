import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import formatDuration from '../utils/formatDuration';
import Avatar from './Avatar';
import Spacer from './Spacer';

export default function CallScreen({ data, onClose }) {
  const windowDimensions = useWindowDimensions();
  const [seconds, setSeconds] = useState(-1);
  const { user } = data;

  useEffect(() => {
    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <BlurView
      tint="dark"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Avatar user={user} size={80} />

      <Text
        style={{
          color: 'white',
          fontSize: 24,
          marginTop: 16,
          fontWeight: '600',
        }}
      >
        {user.nickname}
      </Text>
      <Text style={{ color: 'white', fontSize: 16, marginTop: 8 }}>
        {seconds < 0 ? 'Calling...' : formatDuration(seconds)}
      </Text>
      <Spacer size={windowDimensions.height / 3} />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: 200,
        }}
      >
        <Pressable style={[_styles.callScreenButton, { backgroundColor: '#5B5B5B' }]}>
          <MaterialCommunityIcons name="microphone-off" size={36} color="white" />
        </Pressable>
        <Pressable style={[_styles.callScreenButton, { backgroundColor: '#5B5B5B' }]}>
          <MaterialIcons name="volume-up" size={36} color="white" />
        </Pressable>
        <Pressable style={_styles.callScreenButton} onPress={() => onClose(seconds)}>
          <MaterialIcons name="call-end" size={36} color="white" />
        </Pressable>
      </View>
    </BlurView>
  );
}

const _styles = StyleSheet.create({
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'tajawal-medium',
  },
  headerTitleName: { fontSize: 16, lineHeight: 16, marginBottom: 2 },
  headerTitleNumber: { fontSize: 14, lineHeight: 14 },
  tabBarIcon: { width: 30, height: 30 },
  callScreenButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E53157',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
});
