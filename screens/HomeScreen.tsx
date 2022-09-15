import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { endOfWeek, getDay, startOfWeek } from 'date-fns';
import { useEffect } from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, ViewProps } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import ArrowRightSvg from '../assets/ic_arrow_right.svg';
import CreatePlusSvg from '../assets/ic_create_plus.svg';
import HamburgerIconSvg from '../assets/ic_hamburger.svg';
import InfoSvg from '../assets/ic_info.svg';
import MinusSvg from '../assets/ic_minus.svg';
import PlusSvg from '../assets/ic_plus.svg';
import ScannerSvg from '../assets/ic_scanner.svg';
import SearchPlusSvg from '../assets/ic_search_plus.svg';
import SettingsSvg from '../assets/ic_settings.svg';
import InboxIconSvg from '../assets/ic_ww_inbox.svg';
import Avatar from '../components/Avatar';
import OpacityPressable from '../components/OpacityPressable';
import RowStack from '../components/RowStack';
import Spacer from '../components/Spacer';
import Text from '../components/Text';
import { colors } from '../constants';
import theme from '../constants/theme';
import useBottomTabBarHeight from '../hooks/useBottomTabBarHeight';
import useUnreadCount from '../hooks/useUnreadCount';
import { intlDateFormat } from '../utils/intl';
import { sendbird } from '../utils/sendbird';

const ArcSvg = (props) => (
  <Svg width={146} height={107} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      d="M135.155 103C139.541 93.929 142 83.752 142 73c0-38.108-30.892-69-69-69C34.892 4 4 34.892 4 73c0 10.752 2.46 20.929 6.845 30"
      stroke="url(#a)"
      strokeWidth={7}
      strokeLinecap="round"
    />
    <Defs>
      <LinearGradient id="a" x1={4} y1={68} x2={142} y2={68} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#091792" />
        <Stop offset={1} stopColor="#2558BD" />
      </LinearGradient>
    </Defs>
  </Svg>
);

const Card = (props: ViewProps) => (
  <Animated.View
    exiting={FadeOut.duration(100)}
    {...props}
    style={[
      {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        shadowOpacity: 0.16,
        overflow: 'hidden',
      },
      props.style,
    ]}
  />
);

const useScreenHeader = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const unreadCount = useUnreadCount('HOME_TAB');

  useEffect(() => {
    navigation.setOptions({
      title: 'My Day',
      headerStyle: { backgroundColor: '#000586' },
      headerShadowVisible: false,
      headerTitleAllowFontScaling: false,
      headerTintColor: '#fff',
      headerLeft: () => (
        <OpacityPressable>
          <HamburgerIconSvg />
        </OpacityPressable>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <OpacityPressable onPress={() => navigation.navigate('Inbox')} style={{ position: 'relative' }}>
            <InboxIconSvg />
            {unreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  top: 0,
                  right: 0,
                  backgroundColor: colors.badge,
                }}
              />
            )}
          </OpacityPressable>
          <Spacer size={16} />
          <OpacityPressable onPress={() => navigation.navigate('Settings')}>
            <Avatar size={32} user={sendbird.currentUser} />
          </OpacityPressable>
        </View>
      ),
      headerLeftContainerStyle: { paddingStart: 20 },
      headerRightContainerStyle: { paddingEnd: 20 },
    });
  });
};

const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <RowStack
      style={{
        position: 'relative',
        backgroundColor: colors.topBarBackground,
        paddingTop: 8,
        paddingBottom: 16,
        paddingHorizontal: 16,
      }}
    >
      <TextInput
        style={{
          backgroundColor: 'white',
          borderRadius: 6,
          flex: 1,
          fontSize: 16,
          height: 36,
          paddingHorizontal: 8,
        }}
        onChangeText={setQuery}
      />
      <RowStack
        style={{ position: 'absolute', left: 20, top: 8, height: 36, opacity: query ? 0 : 1 }}
        pointerEvents="none"
      >
        <SearchPlusSvg width={20} height={20} />
        <Spacer size={4} />
        <Text style={{ fontSize: 16, color: '#858585' }}>Track Food</Text>
      </RowStack>
      <Spacer size={16} />
      <OpacityPressable>
        <ScannerSvg />
      </OpacityPressable>
      <Spacer size={4} />
    </RowStack>
  );
};

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  useScreenHeader();

  return (
    <View style={{ flex: 1, position: 'relative', marginBottom: tabBarHeight }}>
      <SearchBar />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Card>
          <View style={{ padding: 16, paddingBottom: 24, backgroundColor: '#43D7F5', alignItems: 'center' }}>
            <Text style={{ textAlign: 'center' }}>
              Week of {intlDateFormat.formatRange(startOfWeek(Date.now()), endOfWeek(Date.now()))}
            </Text>
            <Spacer size={16} />
            <RowStack style={{ paddingHorizontal: 32 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      position: 'relative',
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      marginLeft: index === 0 ? 0 : 16,
                    }}
                  >
                    <Text style={{ textAlign: 'center', color: '@accent', fontWeight: '500' }}>{day}</Text>
                    {getDay(Date.now()) === index && (
                      <View
                        style={{
                          position: 'absolute',
                          width: 42,
                          height: 42,
                          borderWidth: 3,
                          top: -5,
                          left: -5,
                          borderRadius: 100,
                          borderColor: '#0c6cce',
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </RowStack>
          </View>
          <RowStack style={{ marginTop: 16, alignItems: 'flex-end' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={_styles.score}>28</Text>
              <Spacer size={16} />
              <Text style={_styles.scoreCaption}>{'Weekly\nRemaining'}</Text>
            </View>
            <View style={{ position: 'relative', alignItems: 'center', width: 146, paddingTop: 36 }}>
              <ArcSvg style={{ position: 'absolute', left: 0, top: 0 }} />
              <Text style={[_styles.score, { fontSize: 48, lineHeight: 60 }]}>28</Text>
              <Spacer size={16} />
              <Text style={_styles.scoreCaption}>{'Daily\nRemaining'}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={_styles.score}>0</Text>
              <Spacer size={16} />
              <Text style={_styles.scoreCaption}>{'Daily\nUsed'}</Text>
            </View>
          </RowStack>
          <Text style={{ fontSize: 12, color: '#A6A6A6', marginVertical: 24, fontWeight: '600', textAlign: 'center' }}>
            Track veggies and water to add Points
          </Text>
          <RowStack style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
            <View>
              <RowStack>
                <Text style={_styles.title}>Veggies</Text>
                <Spacer size={4} />
                <InfoSvg />
              </RowStack>
              <Text style={_styles.subtitle}>0 servings</Text>
            </View>
            <RowStack>
              <MinusSvg />
              <Spacer size={20} />
              <OpacityPressable>
                <PlusSvg fill={theme.accent} />
              </OpacityPressable>
            </RowStack>
          </RowStack>
          <RowStack style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
            <View>
              <RowStack>
                <Text style={_styles.title}>Water</Text>
                <Spacer size={4} />
                <SettingsSvg />
              </RowStack>
              <Text style={_styles.subtitle}>0 fl oz</Text>
            </View>
            <RowStack>
              <MinusSvg />
              <Spacer size={20} />
              <OpacityPressable>
                <PlusSvg fill={theme.accent} />
              </OpacityPressable>
            </RowStack>
          </RowStack>
          <OpacityPressable>
            <RowStack style={{ paddingHorizontal: 20, paddingVertical: 14, justifyContent: 'space-between' }}>
              <Text style={_styles.title}>Breakfast</Text>
              <ArrowRightSvg />
            </RowStack>
          </OpacityPressable>
          <OpacityPressable>
            <RowStack style={{ paddingHorizontal: 20, paddingVertical: 14, justifyContent: 'space-between' }}>
              <Text style={_styles.title}>Lunch</Text>
              <ArrowRightSvg />
            </RowStack>
          </OpacityPressable>
          <OpacityPressable>
            <RowStack style={{ paddingHorizontal: 20, paddingVertical: 14, justifyContent: 'space-between' }}>
              <Text style={_styles.title}>Dinner</Text>
              <ArrowRightSvg />
            </RowStack>
          </OpacityPressable>
          <OpacityPressable>
            <RowStack style={{ paddingHorizontal: 20, paddingVertical: 14, justifyContent: 'space-between' }}>
              <Text style={_styles.title}>Snacks</Text>
              <ArrowRightSvg />
            </RowStack>
          </OpacityPressable>
        </Card>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          backgroundColor: '#438EF7',
          width: 54,
          height: 54,
          borderRadius: 27,
          right: 8,
          bottom: 16,
          alignItems: 'center',
          justifyContent: 'center',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.16,
          shadowColor: 'black',
          shadowRadius: 0,
        }}
      >
        <CreatePlusSvg />
      </View>
    </View>
  );
}

const _styles = StyleSheet.create({
  score: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  scoreCaption: { color: '#A6A6A6', fontWeight: '500', fontSize: 13, lineHeight: 17, textAlign: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#5E5E5E' },
});
