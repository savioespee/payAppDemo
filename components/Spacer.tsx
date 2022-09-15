import { View } from 'react-native';

export default function Spacer({ size }: { size: number | 'stretch' }) {
  return <View style={size === 'stretch' ? { flex: 1 } : { width: size, height: size }} />;
}
