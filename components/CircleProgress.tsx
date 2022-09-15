import LottieView from 'lottie-react-native';
import { useMemo } from 'react';
import { ViewProps } from 'react-native';

import animation from '../assets/toss-loading-indicator.json';
import useThemeValues from '../hooks/useThemeValues';
import colorizeLottie from '../utils/colorizeLottie';

export default function CircleProgress({ size, color, ...props }: { size: number; color?: string } & ViewProps) {
  const theme = useThemeValues();
  const coloredAnimation = useMemo(() => {
    return colorizeLottie(animation, { 'layers.0.shapes.0.it.2.c.k': color || theme.accent });
  }, [color, theme.accent]);

  return <LottieView autoPlay style={{ width: size, height: size }} source={coloredAnimation} {...props} />;
}
