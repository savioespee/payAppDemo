import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import useThemedSharedValue from '../hooks/useThemedSharedValue';
import styles from '../styles';
import Image from './Image';
import Text from './Text';

export default function NotificationBar({ message, onPress }: { message: string; onPress: () => void }) {
  const paddingRight = useSharedValue(8);

  const [backgroundColor, setBackgroundColor] = useThemedSharedValue('@announcementBarBackgroundDefault');

  const animatedStyles = useAnimatedStyle(() => ({
    paddingRight: withSpring(paddingRight.value),
    backgroundColor: withTiming(backgroundColor.value),
  }));

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => {
        setBackgroundColor('@announcementBarBackgroundHover');
      }}
      onHoverOut={() => {
        setBackgroundColor('@announcementBarBackgroundDefault');
      }}
      onPressIn={() => {
        paddingRight.value = 0;
        setBackgroundColor('@announcementBarBackgroundHover');
      }}
      onPressOut={() => {
        paddingRight.value = 8;
        setBackgroundColor('@announcementBarBackgroundDefault');
      }}
    >
      <Animated.View style={[_styles.container, animatedStyles]}>
        <Image source={require('../assets/ic-announcement.png')} style={[_styles.icon]} />
        <Text
          style={[_styles.message, styles.textXSmall, { fontWeight: '500' }]}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {message}
        </Text>
        <Image source={require('../assets/ic-arrow-right.png')} style={[_styles.arrowIcon]} />
      </Animated.View>
    </Pressable>
  );
}

const _styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '@announcementBarIcon',
    marginHorizontal: 8,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: '@announcementBarContent',
    marginHorizontal: 8,
  },
  message: { flex: 1, color: '@announcementBarContent' },
});
