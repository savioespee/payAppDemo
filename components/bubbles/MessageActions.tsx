import { BlurView } from 'expo-blur';
import { darken } from 'polished';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { primitive } from '../../constants';
import useThemeValues from '../../hooks/useThemeValues';
import CircleProgress from '../CircleProgress';
import Text from '../Text';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

function Action({
  title,
  onPress,
  style,
  isLoading,
  variant = 'default',
}: {
  title: string;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  isLoading?: boolean;
  variant?: MessageActionVariant;
}) {
  const theme = useThemeValues();
  const defaultBackgroundColor =
    {
      dark: '#0D0D0D',
      default: theme.primaryButtonBackgroundDefault,
      light: primitive.neutral[3],
    }[variant] || theme.accent;

  const textColor = {
    dark: 'white',
    default: theme.primaryButtonContent,
    light: '#0D0D0D',
    'translucent-light': 'white',
  }[variant];

  const backgroundColor = useSharedValue(defaultBackgroundColor);
  const scale = useSharedValue(1);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(backgroundColor.value, { duration: 200 }),
  }));
  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
  }));

  const children = isLoading ? (
    <CircleProgress size={16} color={textColor} />
  ) : (
    <Text style={[componentStyles.actionText, { color: textColor }]}>{title}</Text>
  );

  return (
    <Pressable
      disabled={isLoading}
      style={style}
      onPress={onPress}
      onPressIn={() => {
        backgroundColor.value = darken(0.02, defaultBackgroundColor);
        scale.value = 0.98;
      }}
      onPressOut={() => {
        scale.value = 1;
        backgroundColor.value = defaultBackgroundColor;
      }}
      onHoverIn={() => {
        backgroundColor.value = darken(0.02, defaultBackgroundColor);
      }}
      onHoverOut={() => {
        backgroundColor.value = defaultBackgroundColor;
      }}
    >
      {variant === 'translucent-light' ? (
        <AnimatedBlurView tint="light" style={[componentStyles.action, animatedScaleStyle]}>
          {children}
        </AnimatedBlurView>
      ) : (
        <Animated.View style={[componentStyles.action, animatedBackgroundStyle, animatedScaleStyle]}>
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
}

export default function MessageActions({
  actions = [],
  style,
  onActionPress,
  ongoingAction,
}: {
  actions: MessageAction[];
  style: StyleProp<ViewStyle>;
  onActionPress: (action: MessageAction) => void;
  ongoingAction?: MessageAction;
}) {
  return (
    <View style={style}>
      {actions.map((action, index) => {
        const { label, variant } = action;
        return (
          <Action
            key={label}
            style={[index > 0 && { marginTop: 4 }]}
            onPress={() => onActionPress?.(action)}
            title={label}
            variant={variant}
            isLoading={action === ongoingAction}
          />
        );
      })}
    </View>
  );
}

const componentStyles = StyleSheet.create({
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 36,
    overflow: 'hidden',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});
