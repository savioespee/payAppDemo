import { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import useThemeValues from '../../hooks/useThemeValues';
import styles from '../../styles';
import Bubble from '../bubbles/Bubble';

const animateConfig = {
  toValue: 1,
  duration: 1000,
  useNativeDriver: false,
};

const interpolateConfig = {
  inputRange: [0, 0.5, 1],
  outputRange: [0, 1, 0],
};

const TypingIndicator = ({ style }) => {
  const [animatedValue0] = useState(new Animated.Value(0));
  const [animatedValue1] = useState(new Animated.Value(0));
  const [animatedValue2] = useState(new Animated.Value(0));

  useEffect(() => {
    const getLoop = (value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, animateConfig),
          Animated.delay(300),
        ]),
        { iterations: 1000 },
      );

    getLoop(animatedValue0).start();
    Animated.sequence([Animated.delay(100), getLoop(animatedValue1)]).start();
    Animated.sequence([Animated.delay(200), getLoop(animatedValue2)]).start();
  }, [animatedValue0, animatedValue1, animatedValue2]);

  const opacity0 = animatedValue0.interpolate(interpolateConfig);
  const opacity1 = animatedValue1.interpolate(interpolateConfig);
  const opacity2 = animatedValue2.interpolate(interpolateConfig);
  const theme = useThemeValues();
  const dotStyle = useMemo(
    () => [_styles.typingIndicatorDot, { backgroundColor: theme.accent }],
    [theme],
  );

  return (
    <Bubble
      style={[
        styles.rowStack,
        {
          width: 56,
          height: 36,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
        },
        style,
      ]}
    >
      <Animated.View style={[dotStyle, { opacity: opacity0 }]} />
      <Animated.View style={[dotStyle, { opacity: opacity1 }]} />
      <Animated.View style={[dotStyle, { opacity: opacity2 }]} />
    </Bubble>
  );
};

export default TypingIndicator;

const _styles = StyleSheet.create({
  typingIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    margin: 2,
  },
});
