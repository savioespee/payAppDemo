import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import Image from './Image';

export default function BackButton(props: TouchableOpacityProps) {
  return (
    <TouchableOpacity {...props}>
      <Image
        source={require('../assets/ic-arrow-back.png')}
        style={{ width: 24, height: 24, tintColor: '@navigationTintColor' }}
      />
    </TouchableOpacity>
  );
}
