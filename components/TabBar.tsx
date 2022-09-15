import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MyDaySvg from '../assets/ic_navi_calendar.svg';
import DiscoverSvg from '../assets/ic_navi_feed.svg';
import RewardsSvg from '../assets/ic_navi_gift.svg';
import InboxSvg from '../assets/ic_navi_inbox.svg';
import { colors, tabs } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import useUnreadCount from '../hooks/useUnreadCount';
import styles from '../styles';
import Text from './Text';

const tabBarImages = {
  [tabs.myday]: MyDaySvg,
  [tabs.rewards]: RewardsSvg,
  [tabs.discover]: DiscoverSvg,
  [tabs.inbox]: InboxSvg,
};

const TabContainer = (props) => {
  if (Platform.OS === 'web') {
    return <View {...props} />;
  }
  return <SafeAreaView {...props} />;
};

export default function TabBar({ state, descriptors, navigation }) {
  const unreadCount = useUnreadCount('TAB_BAR');
  const theme = useThemeValues();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        backgroundColor: 'white',
      }}
    >
      <TabContainer
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 32,
          paddingVertical: 6,
        }}
        edges={['bottom']}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const tintColor = isFocused ? theme.activeTab : theme.inactiveTab;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              disabled={route.name !== tabs.myday && route.name !== tabs.inbox}
              style={[
                styles.centerChildren,
                {
                  paddingTop: 10,
                  paddingStart: index > 0 ? 16 : 0,
                  paddingEnd: index < state.routes.length - 1 ? 16 : 0,
                },
              ]}
            >
              {({ pressed }) => {
                const Component = tabBarImages[route.name];
                return (
                  <View style={{ position: 'relative' }}>
                    <Component width={28} height={28} fill={pressed ? theme.activeTab : tintColor} />
                    {route.name === tabs.myday && (
                      <Text
                        style={{
                          position: 'absolute',
                          color: 'white',
                          width: '100%',
                          textAlign: 'center',
                          top: 6,
                          fontSize: 14,
                        }}
                      >
                        {new Date().getDate()}
                      </Text>
                    )}
                    {route.name === tabs.inbox && unreadCount > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          top: -1,
                          right: -1,
                          backgroundColor: colors.badge,
                        }}
                      />
                    )}
                  </View>
                );
              }}
            </Pressable>
          );
        })}
      </TabContainer>
    </View>
  );
}
