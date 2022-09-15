import { TextInput } from 'react-native';

export default function MultiLineTextInput(props) {
  return <TextInput multiline {...props} allowFontScaling={false} />;
}
