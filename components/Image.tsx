import { ComponentProps } from 'react';
import { Image as RNImage, ImageSourcePropType, ImageURISource, Platform } from 'react-native';
import { Image as ImageWithCache } from 'react-native-expo-image-cache';

import useThemedStyle from '../hooks/useThemedStyle';

type Props = Omit<ComponentProps<typeof RNImage>, 'onError' | 'source'> & {
  source?: ImageSourcePropType;
  uri?: string;
};

export default function Image({ source, style: styleProp, uri: uriProp, ...props }: Props) {
  const style = useThemedStyle(styleProp);
  const uri = (source as ImageURISource)?.uri || uriProp;
  const commonProps = { style, ...props };

  if (Platform.OS === 'web') {
    return <RNImage source={uri ? { uri } : source!} {...commonProps} />;
  }
  if (uri) {
    return <ImageWithCache transitionDuration={300} tint="light" uri={uri} {...commonProps} />;
  }
  return <RNImage source={source!} {...commonProps} />;
}
