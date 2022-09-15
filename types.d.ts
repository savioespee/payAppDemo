import 'react-native';

declare module 'react-native' {
  interface PressableProps {
    onHoverIn?: (event: MouseEvent) => void;
    onHoverOut?: (event: MouseEvent) => void;
  }
}
