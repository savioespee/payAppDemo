import { ComponentProps, useMemo } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

import { colors } from '../constants';
import useThemedStyle from '../hooks/useThemedStyle';

(RNText as any).defaultProps = {
  ...(RNText as any).defaultProps,
  allowFontScaling: false,
};

export default function Text({ style: styleProp, ...props }: ComponentProps<typeof RNText>) {
  const themedStyle = useThemedStyle(styleProp);

  const style = useMemo(() => {
    const fontSize = themedStyle.fontSize || 14;
    const color = themedStyle.color || colors.text;
    const lineHeight = themedStyle.lineHeight || fontSize * 1.5;

    const flattened = StyleSheet.flatten([themedStyle, { lineHeight, color, fontSize }]);
    const fontWeight = flattened.fontWeight || 'normal';
    return [flattened, { fontWeight }];
  }, [themedStyle]);

  return <RNText style={style} {...props} />;
}
