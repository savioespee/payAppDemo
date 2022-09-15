import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from '../components/TabBar';
import { tabs } from '../constants';
import HomeScreen from './HomeScreen';
import InboxScreen from './InboxScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name={tabs.myday} component={HomeScreen} />
      <Tab.Screen name={tabs.rewards} component={HomeScreen} />
      <Tab.Screen name={tabs.discover} component={HomeScreen} />
      <Tab.Screen name={tabs.inbox} component={InboxScreen} />
    </Tab.Navigator>
  );
}
