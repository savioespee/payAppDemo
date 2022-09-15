import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Image, ImageProps, ImageRequireSource } from 'react-native';

export default function AssetBlockImage(props: ImageProps & { source: ImageRequireSource }) {
  const { width: screenWidth } = useWindowDimensions();

  const aspectRatio = useMemo(() => {
    const { width, height } = Image.resolveAssetSource(props.source);
    return height / width;
  }, [props.source]);

  return <Image {...props} style={[props.style, { width: screenWidth, height: screenWidth * aspectRatio }]} />;
}
