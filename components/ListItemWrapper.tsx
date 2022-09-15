import { StyleSheet, useWindowDimensions, View, ViewProps } from 'react-native';

import { TABLET_LANDSCAPE_WIDTH } from '../constants';

export default function ListItemWrapper({ style, ...props }: ViewProps) {
  const { width: screenWidth } = useWindowDimensions();
  return (
    <View
      style={StyleSheet.flatten([
        style,
        screenWidth > TABLET_LANDSCAPE_WIDTH && {
          width: TABLET_LANDSCAPE_WIDTH,
          alignSelf: 'center',
        },
      ])}
      {...props}
    />
  );
}
