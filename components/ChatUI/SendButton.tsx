import { StyleProp, ViewStyle } from 'react-native';

import Image from '../Image';
import OpacityPressable from '../OpacityPressable';

export default function SendButton({
  isMessageEmpty,
  onPress,
  style,
}: {
  isMessageEmpty?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <OpacityPressable
      style={[
        {
          padding: 4,
          marginHorizontal: 8,
          position: 'absolute',
          right: isMessageEmpty ? -40 : 0,
          top: 12,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isMessageEmpty}
    >
      <Image source={require('../../assets/ic-send.png')} style={{ width: 24, height: 24, tintColor: '@accent' }} />
    </OpacityPressable>
  );
}
