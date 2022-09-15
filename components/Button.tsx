import { darken } from 'polished';
import { useEffect, useMemo } from 'react';
import { Pressable, PressableProps, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, primitive } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import CircleProgress from './CircleProgress';
import Text from './Text';

const sizeMap = {
  small: 26,
  default: 44,
  large: 56,
};

const paddingHorizontalMap = {
  default: 12,
  large: 16,
};

const fontSizeMap = {
  small: 12,
  default: 16,
};

const progressSizeMap = {
  small: 12,
  default: 24,
};

const useColorMap = () => {
  const theme = useThemeValues();
  return useMemo(() => {
    const colorMap = {
      primary: {
        background: theme.primaryButtonBackgroundDefault,
        backgroundHovered: theme.primaryButtonBackgroundHover,
        content: colors.white,
      },
      secondary: {
        background: '#CCE5FF',
        backgroundHovered: darken(0.02, '#CCE5FF'),
        content: colors.text,
      },
      disabled: {
        background: primitive.neutral[3],
        backgroundHovered: primitive.neutral[3],
        content: primitive.neutral[6],
      },
    };
    return colorMap;
  }, [theme.primaryButtonBackgroundDefault, theme.primaryButtonBackgroundHover]);
};

type Props = {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small' | 'large';
  isLoading?: boolean;
  rounded?: boolean;
  textStyle?: TextStyle;
} & PressableProps;

export default function Button({
  title,
  variant = 'primary',
  size = 'default',
  isLoading,
  rounded = false,
  disabled,
  textStyle,
  ...props
}: Props) {
  const colorMap = useColorMap();
  const { background, backgroundHovered, content: contentColor } = colorMap[disabled ? 'disabled' : variant];

  const backgroundColor = useSharedValue(background);
  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    transform: [{ scale: withTiming(scale.value, { duration: 100 }) }],
  }));

  useEffect(() => {
    const { background } = colorMap[disabled ? 'disabled' : variant];
    backgroundColor.value = background;
  }, [backgroundColor, colorMap, disabled, variant]);

  const paddingHorizontal = paddingHorizontalMap[size] || paddingHorizontalMap.default;
  const height = sizeMap[size] || sizeMap.default;

  function getRadius() {
    if (rounded) {
      return height / 2;
    }
    return 8;
  }

  return (
    <Pressable
      disabled={disabled || isLoading}
      onHoverIn={() => {
        backgroundColor.value = withTiming(backgroundHovered);
      }}
      onHoverOut={() => {
        backgroundColor.value = withTiming(background);
      }}
      onPressIn={() => {
        scale.value = 0.98;
        backgroundColor.value = withTiming(backgroundHovered);
      }}
      onPressOut={() => {
        scale.value = 1;
        backgroundColor.value = withTiming(background);
      }}
      {...props}
    >
      <Animated.View
        style={[
          animatedStyles,
          {
            paddingHorizontal,
            height,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: getRadius(),
          },
        ]}
      >
        {isLoading ? (
          <CircleProgress size={progressSizeMap[size] || progressSizeMap.default} color={contentColor} />
        ) : (
          <Text
            style={[
              {
                textAlign: 'center',
                fontSize: fontSizeMap[size] || fontSizeMap.default,
                color: contentColor,
                fontWeight: '600',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
