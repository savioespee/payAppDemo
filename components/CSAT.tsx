import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { ImageRequireSource, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import useThemeValues from '../hooks/useThemeValues';
import styles from '../styles';
import useBubbleMaxWidth from './bubbles/useBubbleMaxWidth';
import Spacer from './Spacer';
import Text from './Text';

type OptionType = 'great' | 'bad';

const imageMap: Record<OptionType, { enabled: ImageRequireSource; disabled: ImageRequireSource }> = {
  great: {
    enabled: require('../assets/emoji-great-enabled.png'),
    disabled: require('../assets/emoji-great-disabled.png'),
  },
  bad: {
    enabled: require('../assets/emoji-bad-enabled.png'),
    disabled: require('../assets/emoji-bad-disabled.png'),
  },
};

function Option({
  label,
  type,
  status = 'init',
  onPress,
}: {
  label: string;
  type: OptionType;
  status?: 'selected' | 'unselected' | 'init';
  onPress?: () => void;
}) {
  const theme = useThemeValues();
  const imageSource = useMemo(() => {
    return imageMap[type][status === 'unselected' ? 'disabled' : 'enabled'];
  }, [status, type]);

  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const backgroundColor = useSharedValue('#FFFFFF00');
  const scale = useSharedValue(1);
  const emojiTranslateX = useSharedValue(0);
  const emojiTranslateY = useSharedValue(0);

  useLayoutEffect(() => {
    if (status === 'selected') {
      backgroundColor.value = theme.csatSelectedItemBackground;
    } else {
      backgroundColor.value = '#FFFFFF00';
    }
  }, [backgroundColor, status, theme.csatSelectedItemBackground]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    transform: [
      {
        scale: withSpring(scale.value, {
          damping: 10,
          mass: 1,
          stiffness: 200,
        }),
      },
    ],
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: emojiTranslateY.value }, { translateX: emojiTranslateX.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={status !== 'init'}
      onPressIn={() => {
        if (statusRef.current === 'init') {
          scale.value = 0.96;
        }
      }}
      onPressOut={() => {
        if (statusRef.current === 'init') {
          scale.value = 1;
        }
      }}
      onHoverIn={() => {
        if (statusRef.current === 'init') {
          backgroundColor.value = 'white';
          if (type === 'great') {
            emojiTranslateY.value = withSpring(0, {
              velocity: -100,
              stiffness: 50,
            });
          } else {
            emojiTranslateX.value = withSpring(0, {
              velocity: -100,
              stiffness: 200,
            });
          }
        }
      }}
      onHoverOut={() => {
        if (statusRef.current === 'init') {
          backgroundColor.value = '#FFFFFF00';
        }
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            borderRadius: 8,
            minHeight: 64,
            minWidth: 64,
            paddingHorizontal: 12,
            paddingVertical: 4,
            position: 'relative',
            justifyContent: 'flex-end',
          },
          animatedStyle,
        ]}
      >
        <Animated.Image
          source={imageSource}
          style={[{ width: 40, height: 40, top: 4, position: 'absolute' }, emojiAnimatedStyle]}
        />
        <Text style={[styles.textXSmall, { textAlign: 'center' }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function CSAT({
  score = 0,
  question,
  style,
  onSelect,
}: {
  score?: number;
  question: string;
  onSelect?: (score: number) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const handleSelect = async (score: number) => {
    await onSelect?.(score);
  };

  const maxWidth = useBubbleMaxWidth();

  return (
    <View
      style={[
        {
          minWidth: 275,
          maxWidth,
          backgroundColor: '#F2F3F5',
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={[styles.textSmedium, styles.textBold, { textAlign: 'center', marginBottom: 16 }]}>{question}</Text>
      <View style={styles.rowStack}>
        <Option
          label="Great"
          type="great"
          status={score === 0 ? 'init' : score > 0 ? 'selected' : 'unselected'}
          onPress={() => handleSelect(1)}
        />
        <Spacer size={24} />
        <Option
          label="Bad"
          type="bad"
          status={score === 0 ? 'init' : score > 0 ? 'unselected' : 'selected'}
          onPress={() => handleSelect(-1)}
        />
      </View>
    </View>
  );
}
