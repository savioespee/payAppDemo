import { rgba } from 'polished';
import { memo } from 'react';
import { View } from 'react-native';
import SendBird from 'sendbird';

import { colors } from '../../constants';
import styles from '../../styles';
import { intlDateLineFormat } from '../../utils/intl';
import Avatar from '../Avatar';
import Text from '../Text';
import chatMessageStyles from './chatMessageStyles';
import TypingIndicator from './TypingIndicator';

const bubbleBackgroundColor = colors.incomingMessageBackground;

function TypingIndicatorBubble({
  typingMember,
  isFirstMessageOfDay,
  isFollowingSameSender,
  isFollowedBySameSender,
}: {
  typingMember: SendBird.Member;
  isFirstMessageOfDay: boolean;
  isFollowingSameSender: boolean;
  isFollowedBySameSender: boolean;
}) {
  const isAvatarHidden = isFollowingSameSender;
  const isNicknameVisible = !isFollowedBySameSender;

  function renderMessage() {
    return (
      <View style={chatMessageStyles.messageRow}>
        <Avatar user={typingMember} size={28} style={[chatMessageStyles.avatar, { opacity: isAvatarHidden ? 0 : 1 }]} />
        <View style={[chatMessageStyles.messageTextWrapper, { alignItems: 'flex-start' }]}>
          {isNicknameVisible && (
            <Text
              style={[
                {
                  marginBottom: 2,
                  fontWeight: '700',
                  color: rgba('black', 0.5),
                  paddingLeft: 12,
                },
                styles.textXSmall,
              ]}
            >
              {typingMember.nickname}
            </Text>
          )}
          <TypingIndicator style={{ backgroundColor: bubbleBackgroundColor }} />
        </View>
      </View>
    );
  }
  return (
    <View>
      {isFirstMessageOfDay && <Text style={chatMessageStyles.dateLine}>{intlDateLineFormat.format(Date.now())}</Text>}
      {renderMessage()}
    </View>
  );
}

export default memo(TypingIndicatorBubble);
