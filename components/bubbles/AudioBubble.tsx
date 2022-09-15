import { addMilliseconds, format } from 'date-fns';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BUBBLE_PADDING, primitive } from '../../constants';
import styles from '../../styles';
import Image from '../Image';
import Text from '../Text';
import Bubble from './Bubble';

function formatDuration(ms) {
  try {
    const helperDate = addMilliseconds(0, ms);
    return format(helperDate, 'mm:ss');
  } catch {
    return '00:00';
  }
}

export default function AudioBubble({ style, message }) {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const statusRef = useRef<{
    isPlaying: boolean;
    duration: number;
    position: number;
    sound?: Audio.Sound;
  }>({ isPlaying: false, duration: 0, position: 0 });

  useEffect(() => {
    statusRef.current = { isPlaying, duration, position, sound };
  });

  useEffect(() => {
    async function loadSound() {
      if (!message.plainUrl) {
        return;
      }

      try {
        const { sound } = await Audio.Sound.createAsync({ uri: message.plainUrl }, { shouldPlay: true, volume: 0 });
        sound.setOnPlaybackStatusUpdate((status) => {
          if (
            status.isLoaded &&
            typeof status.durationMillis === 'number' &&
            status.durationMillis > 0 &&
            !statusRef.current.duration
          ) {
            statusRef.current.duration = status.durationMillis;
            setDuration(status.durationMillis);
            sound.setStatusAsync({ shouldPlay: false });
          }
        });
        setSound(sound);
      } catch (error) {
        console.error(error);
      }
    }

    loadSound();
  }, [message.plainUrl]);

  const toggleSound = async () => {
    if (!sound) {
      return;
    }

    if (statusRef.current.isPlaying) {
      await sound.setStatusAsync({ shouldPlay: false });
      return;
    }

    await sound.setStatusAsync({
      shouldPlay: true,
      volume: 1,
      positionMillis: statusRef.current.position === statusRef.current.duration ? 0 : undefined,
    });

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        if (status.isPlaying !== statusRef.current.isPlaying) {
          setIsPlaying(status.isPlaying);
        }
        if (status.durationMillis !== statusRef.current.duration) {
          setDuration(status.durationMillis || 0);
        }
        if (status.positionMillis !== statusRef.current.position) {
          setPosition(status.positionMillis);
        }
      }
    });
  };

  useEffect(() => {
    if (sound) {
      return () => {
        sound.unloadAsync();
      };
    }
  }, [sound]);

  const [isHovered, setIsHovered] = useState(false);
  const scale = useSharedValue(1);
  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 100 }) }],
  }));

  return (
    <Pressable
      onHoverIn={() => {
        setIsHovered(true);
      }}
      onHoverOut={() => {
        setIsHovered(false);
      }}
      onPressIn={() => {
        scale.value = 0.95;
      }}
      onPressOut={() => {
        scale.value = 1;
      }}
      onPress={toggleSound}
      style={style}
    >
      <Bubble
        style={[
          componentStyles.container,
          bubbleAnimatedStyle,
          { backgroundColor: isHovered ? primitive.neutral[3] : '#F2F3F5' },
        ]}
      >
        <Image
          source={isPlaying ? require('../../assets/ic-pause.png') : require('../../assets/ic-streaming.png')}
          style={componentStyles.playButton}
        />
        <Image
          source={require('../../assets/voice-memo-graph.png')}
          style={[
            componentStyles.graph,
            {
              tintColor: isHovered ? '@accent' : primitive.neutral[5],
            },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.textXSmall}>{formatDuration(duration)}</Text>
      </Bubble>
    </Pressable>
  );
}

const componentStyles = StyleSheet.create({
  playButton: {
    width: 32,
    aspectRatio: 1,
    marginRight: 8,
    tintColor: '@accent',
  },
  container: StyleSheet.flatten([
    styles.rowStack,
    {
      padding: BUBBLE_PADDING,
      alignItems: 'center',
      width: 192,
    },
  ]),
  graph: {
    flex: 1,
    height: 28,
    width: 87,
    marginRight: 8,
  },
});
