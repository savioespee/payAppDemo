import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';

export default function useBottomTabBarHeight() {
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  return tabBarHeight || 0;
}
