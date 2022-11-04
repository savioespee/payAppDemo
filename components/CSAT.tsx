import { ComponentType, Fragment, ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Platform, Pressable, StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import SvgEmojiAverage from '../assets/emoji-average.svg';
import SvgEmojiExcellent from '../assets/emoji-excellent.svg';
import SvgEmojiGood from '../assets/emoji-good.svg';
import SvgEmojiPoor from '../assets/emoji-poor.svg';
import SvgEmojiWorst from '../assets/emoji-worst.svg';

import useThemeValues from '../hooks/useThemeValues';
import styles from '../styles';
import useBubbleMaxWidth from './bubbles/useBubbleMaxWidth';
import Image from './Image';
import RowStack from './RowStack';
import Spacer from './Spacer';
import Text from './Text';


function Option({
  label,
  // type,
  image,
  status = 'init',
  onPress,
}: {
  label: string;
  // type: OptionType;
  image: ReactNode;
  status?: 'selected' | 'unselected' | 'init';
  onPress?: () => void;
}) {
  const theme = useThemeValues();

  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const backgroundColor = useSharedValue('#FFFFFF00');
  const scale = useSharedValue(1);

  useLayoutEffect(() => {
    if (status === 'selected') {
      backgroundColor.value = theme.csatSelectedItemBackground;
    } else {
      backgroundColor.value = '#FFFFFF00';
    }
  }, [backgroundColor, status, theme]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: status === 'unselected' ? 0.3 : 1,
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
            width: 56,
            height: 64,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            position: 'relative',
          },
          animatedStyle,
        ]}
      >
         {image}
        <Text
          style={{
            ...styles.textXXXSmall,
            textAlign: 'center',
            marginTop: 6,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function getImageElement(resolvedModule: unknown) {
  if (Platform.OS === 'web') {
    return <Image source={{ uri: resolvedModule as string }} style={{ width: 32, height: 32 }} />;
  }
  const Component = resolvedModule as ComponentType;
  return <Component />;
}

export default function CSAT({
  score = 0,
  question,
  style,
  type,
  onSelect,
}: {
  score?: number;
  question: string;
  onSelect?: (score: number) => void;
  type: CSATType;
  style?: StyleProp<ViewStyle>;
}) {
  const handleSelect = async (score: number) => {
    await onSelect?.(score);
  };


  const bubbleMaxWidth = useBubbleMaxWidth();

  const options = useMemo(() => {
    if (type === 'binary') {
      return [
        {
          label: 'Great',
          score: 1,
          image: getImageElement(SvgEmojiGood),
        },
        {
          label: 'Bad',
          score: -1,
          image: getImageElement(SvgEmojiPoor),
        },
      ];
    }
    return [
      {
        label: 'Worst',
        score: 1,
        image: getImageElement(SvgEmojiWorst),
      },
      {
        label: 'Poor',
        score: 2,
        image: getImageElement(SvgEmojiPoor),
      },
      {
        label: 'Average',
        score: 3,
        image: getImageElement(SvgEmojiAverage),
      },
      {
        label: 'Good',
        score: 4,
        image: getImageElement(SvgEmojiGood),
      },
      {
        label: 'Excellent',
        score: 5,
        image: getImageElement(SvgEmojiExcellent),
      },
    ];
  }, [type]);

  const { width: screenWidth } = useWindowDimensions();

  return (
    <View
      style={[
        {
          maxWidth: type === '5-scale' ? screenWidth - 68 : bubbleMaxWidth,
          backgroundColor: '#F2F3F5',
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
        },
        style,
      ]}
    >
         <Text
        style={{
          ...styles.textSmedium,
          lineHeight: styles.textSmall.lineHeight,
          textAlign: 'center',
          marginBottom: 16,
          fontWeight: 'bold',
        }}
      >
        {question}
      </Text>
      <RowStack>
        {options.map(({ label, image, score: optionScore }, index) => (
          <Fragment key={label}>
            {index > 0 && <Spacer size={4} />}
        <Option
          label={label}
          image={image}
          status={score === 0 ? 'init' : score === optionScore ? 'selected' : 'unselected'}
          onPress={() => handleSelect(optionScore)}
        />
      </Fragment>
    ))}
  </RowStack>
    </View>
  );
}
