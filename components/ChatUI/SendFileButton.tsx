import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import AddSvg from '../../assets/icon-add.svg';
import CircleProgress from '../CircleProgress';

export default function SendFileButton({
  disabled,
  onPress,
  isLoading,
  style,
}: {
  disabled?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
  style?: TouchableOpacityProps['style'];
}) {
  return (
    <TouchableOpacity
      style={[
        {
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        },
        disabled && { opacity: 0.25 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? <CircleProgress size={20} color="black" /> : <AddSvg width={24} height={24} />}
    </TouchableOpacity>
  );
}
