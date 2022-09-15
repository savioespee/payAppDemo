import { View, ViewProps } from 'react-native';

export default function RowStack(props: ViewProps) {
  return <View {...props} style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]} />;
}
