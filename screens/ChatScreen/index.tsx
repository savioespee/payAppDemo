import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChannelCover from '../../components/ChannelCover';
import ChatUI, { ChatUIImperativeHandle } from '../../components/ChatUI';
import CircleProgress from '../../components/CircleProgress';
import IconButton from '../../components/IconButton';
import LanguageButton from '../../components/LanguageButton';
import SelectionModal from '../../components/SelectionModal';
import Spacer from '../../components/Spacer';
import Text from '../../components/Text';
import { colors, languageNames, USER_METADATA_KEYS } from '../../constants';
import { AuthContext } from '../../contexts';
import useCurrentUserLanguage from '../../hooks/useCurrentUserLanguage';
import styles from '../../styles';
import alert from '../../utils/alert';
import { getChannelBadge, getChannelCounterpart, getChannelTitle, isChannelVerified } from '../../utils/common';
import { sendbird } from '../../utils/sendbird';

export default function ChatScreen() {
  const { currentUser, updateCurrentUserState } = useContext(AuthContext);
  const [channel, setChannel] = useState<SendBird.GroupChannel | null>(null);
  const language = useCurrentUserLanguage();
  const route = useRoute();
  const navigation = useNavigation();
  const { channelUrl } = route.params as { channelUrl: string };
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const chatUIRef = useRef<ChatUIImperativeHandle>(null);

  useEffect(() => {
    async function prepare() {
      if (!channelUrl) {
        return;
      }

      try {
        const channel = await sendbird.GroupChannel.getChannel(channelUrl);
        setChannel(channel);
      } catch (error) {
        alert(String(error));
        navigation.navigate('Inbox' as any);
      }
    }

    prepare();
  }, [channelUrl, navigation]);

  const showCallScreen = useCallback(() => {
    chatUIRef.current?.showCallScreen();
  }, []);

  const { width: screenWidth } = useWindowDimensions();

  const canCall = useMemo(() => {
    if (!channel) {
      return false;
    }
    const otherUser = getChannelCounterpart(channel);
    const canCall = !!otherUser && otherUser.metaData[USER_METADATA_KEYS.userType] === 'friend';
    return canCall;
  }, [channel]);

  const getChannelSubtitle = useCallback(
    (channel) => {
      if (isChannelVerified(channel)) {
        return null;
      }

      if (channel.members.length > 2) {
        return (
          <Text style={[{ marginTop: -2, color: colors.secondaryText }, styles.textXSmall]}>
            {channel.members.length} people
          </Text>
        );
      }

      if (!canCall) {
        return null;
      }

      return (
        <View
          style={{
            alignItems: 'center',
            display: 'flex',
            marginTop: -2,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              marginRight: 4,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.onlineColor,
            }}
          />
          <Text style={[{ color: colors.secondaryText }, styles.textXSmall]}>Online</Text>
        </View>

      );
    },
    [canCall],
  );

  const updateTitle = useCallback(() => {
    const headerTitle = () =>
      channel && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <ChannelCover channel={channel} size={36} style={{ marginRight: 8 }} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={[styles.textMedium, { fontWeight: '600', marginRight: 2 }]} numberOfLines={1}>
                {getChannelTitle({ channel, isChannelList: false })}
              </Text>
              {getChannelBadge(channel)}
            </View>
            {getChannelSubtitle(channel)}
          </View>
        </View>
      );

    const headerRight = () => {
      if (!channel || !currentUser) {
        return null;
      }

      const callButton = canCall ? (
        <IconButton
          key="call"
          onPress={showCallScreen}
          tintColor="@navigationTintColor"
          source={require('../../assets/ic-call.png')}
          size={22}
        />
      ) : null;

      return (
        <>
          {callButton}
          <LanguageButton onPress={() => setIsLanguageModalVisible(true)} />
        </>
      );
    };

    navigation.setOptions({
      header: () => {
        return (
          <View style={{ backgroundColor: 'white' }}>
            <SafeAreaView
              edges={['top']}
              style={[
                styles.rowStack,
                {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.rowStack,
                  {
                    width: screenWidth,
                    alignItems: 'center',
                    height: 56,
                    paddingHorizontal: 8,
                  },
                ]}
              >
                <IconButton
                  source={require('../../assets/ic-arrow-back.png')}
                  tintColor="@navigationTintColor"
                  onPress={() => navigation.goBack()}
                />
                <Spacer size={6} />
                {headerTitle()}
                <View style={[styles.rowStack, { right: 8, position: 'absolute', alignItems: 'center' }]}>
                  {headerRight()}
                </View>
              </View>
            </SafeAreaView>
          </View>
        );
      },
      title: channel ? getChannelTitle({ channel, isChannelList: false }) : '',
    });
  }, [canCall, channel, currentUser, getChannelSubtitle, navigation, screenWidth, showCallScreen]);

  useLayoutEffect(() => {
    updateTitle();
  }, [updateTitle]);

  if (!channel) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircleProgress size={32} />
      </View>
    );
  }

  return (
    <>
      <ChatUI ref={chatUIRef} />
      <SelectionModal
        options={[languageNames.en, languageNames.es, languageNames.ko, languageNames.zh, languageNames.id, languageNames.hi, languageNames.te, languageNames.ta]}
        selectedOption={languageNames[language] || languageNames.en}
        onSelect={(option) => {
          setIsLanguageModalVisible(false);
          const match = Object.entries(languageNames).find(([, value]) => value === option);
          if (!match) {
            return;
          }
          sendbird.currentUser.updateMetaData(
            { [USER_METADATA_KEYS.language]: match[0] },
            true,
            (newMetaData, error) => {
              if (error) {
                console.error(error);
                return;
              }
              updateCurrentUserState();
            },
          );
        }}
        title="Translate to"
        layout={Platform.OS === 'android' ? 'dialog' : 'actionSheet'}
        isVisible={isLanguageModalVisible}
        onCancel={() => setIsLanguageModalVisible(false)}
      />
    </>
  );
}
