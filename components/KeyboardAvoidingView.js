import { useHeaderHeight } from '@react-navigation/elements';
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default function KeyboardAvoidingView(props) {
  const headerHeight = useHeaderHeight();
  return (
    <RNKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={headerHeight + (isIphoneX() ? -34 : 0)}
      {...props}
    />
  );
}
