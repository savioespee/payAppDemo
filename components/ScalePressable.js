import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const ScalePressable = ({ children, ...props }) => {
  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = 0.95;
      }}
      onPressOut={() => {
        scale.value = 1;
      }}
      {...props}
    >
      <Animated.View style={[animatedStyles]}>{children}</Animated.View>
    </Pressable>
  );
};

export default ScalePressable;
