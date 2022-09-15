import Image from './Image';

export default function BrandLogoAvatar({ size, style }: { size: number; style?: any }) {
  return (
    <Image
      source={require('../assets/avatars/live-events.png')}
      resizeMode="contain"
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
}
