import { useMemo } from 'react';
import { ImageSourcePropType, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { primitive } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import styles from '../styles';
import Image from './Image';
import Text from './Text';

const backgroundScales = {
  hidden: 0.8,
  visible: 1,
};

export default function IconButton({
  children,
  source,
  style,
  size = 24,
  tintColor: tintColorProp,
  label,
  ...props
}: PressableProps & {
  style?: StyleProp<ViewStyle>;
  source?: ImageSourcePropType;
  size?: number;
  label?: string;
  tintColor?: true | string;
}) {
  const theme = useThemeValues();
  const backgroundScale = useSharedValue(backgroundScales.hidden);
  const backgroundOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(1);

  const animatedBackgroundStyles = useAnimatedStyle(() => ({
    transform: [{ scale: backgroundScale.value }],
    opacity: backgroundOpacity.value,
  }));

  const animatedButtonStyles = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const tintColor = useMemo(() => {
    if (tintColorProp === true) {
      return theme.accent;
    }
    return tintColorProp;
  }, [theme.accent, tintColorProp]);

  const hoverBackgroundSize = Math.max(36, size + 12);

  return (
    <Pressable
      onHoverIn={() => {
        backgroundScale.value = withTiming(backgroundScales.visible);
        backgroundOpacity.value = withTiming(1);
      }}
      onHoverOut={() => {
        backgroundScale.value = withTiming(backgroundScales.hidden);
        backgroundOpacity.value = withTiming(0);
      }}
      onPressIn={() => {
        buttonOpacity.value = withTiming(0.3, { duration: 0 });
        backgroundOpacity.value = withTiming(0, { duration: 0 });
      }}
      onPressOut={() => {
        buttonOpacity.value = withTiming(1);
        backgroundOpacity.value = withTiming(0);
      }}
      style={[
        {
          position: 'relative',
          paddingVertical: label ? 10 : 6,
          paddingHorizontal: label ? 8 : 6,
          minWidth: 36,
          minHeight: 36,
          alignItems: 'center',
          justifyContent: 'center',
        },
        !label && { width: hoverBackgroundSize, height: hoverBackgroundSize },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          animatedBackgroundStyles,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: primitive.neutral[2],
          },
          label
            ? { right: 0, bottom: 0, borderRadius: 8 }
            : {
                width: hoverBackgroundSize,
                height: hoverBackgroundSize,
                borderRadius: hoverBackgroundSize / 2,
              },
        ]}
      />
      <Animated.View
        style={[
          animatedButtonStyles,
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {children || <Image source={source} style={{ width: size, height: size, tintColor }} />}
        {label && (
          <Text
            style={[
              styles.textSmedium,
              {
                fontWeight: '500',
                color: tintColor || '@accent',
                marginLeft: 4,
              },
            ]}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
