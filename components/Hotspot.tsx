import { NavigationProp, useNavigation } from '@react-navigation/native';
import { rgba } from 'polished';
import { Pressable, PressableProps } from 'react-native';

type HotspotProps = PressableProps & {
  onPressOverlayColor?: string;
  onPressOverlayOpacity?: number;
  toScreenName?: string;
  debug?: boolean;
};

export default function Hotspot({
  onPressOverlayColor = 'white',
  onPressOverlayOpacity = 0.5,
  toScreenName,
  onPress,
  debug = false,
  style,
  ...props
}: HotspotProps) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <Pressable
      {...props}
      onPress={(event) => {
        if (onPress) {
          onPress(event);
          return;
        }
        if (toScreenName) {
          navigation.navigate(toScreenName);
        }
      }}
      style={(props) => {
        return [
          {
            backgroundColor: props.pressed
              ? rgba(onPressOverlayColor, onPressOverlayOpacity)
              : debug
              ? rgba('pink', 0.5)
              : 'transparent',
          },
          typeof style === 'function' ? style(props) : style,
        ];
      }}
    />
  );
}
