import { GroupChannel, UserMessage } from 'sendbird';

import { botUserIds, messageCustomTypes } from '../constants';
import { getScenarioDataFromChannelUrl } from '../utils/scenarioUtils';
import { getChannelState } from './ChannelStateUtils';
import { sendMessageAndTranslate } from './utils';

export default async function handleUserSentMessage({
  message,
  channel,
}: {
  message: UserMessage;
  channel: GroupChannel;
}) {
  const messageCustomType = message.customType;

  if (
    !message.sender ||
    Object.values(botUserIds).includes(message.sender.userId) ||
    messageCustomType === messageCustomTypes.callStarted ||
    messageCustomType === messageCustomTypes.callEnded
  ) {
    return;
  }

  const channelUrl = channel.url;

  if (messageCustomType !== messageCustomTypes.interactiveResponse) {
    const channelState = await getChannelState(channelUrl);
    if (channelState == null) {
      return;
    }
    const channelScenario = await getScenarioDataFromChannelUrl(channelUrl);
    if (!channelScenario) {
      return;
    }
    const hasSuggestedReplies = (channelScenario.states[channelState]?.suggestedReplies ?? []).length > 0;

    if (hasSuggestedReplies) {
      sendMessageAndTranslate(channelUrl, {
        message_type: 'ADMM',
        message: 'Could not recognize your response. Please try one of our suggested replies!',
        custom_type: messageCustomTypes.couldNotRecognize,
      });
    }

    return;
  }
}
