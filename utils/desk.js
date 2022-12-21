import SendBirdDesk from 'sendbird-desk';

import { parseMessageData } from './dataUtils';
import { sendbird } from './sendbird';

export function isMessageVisible(message) {
  try {
    const data = parseMessageData(message.data);

    message.isSystemMessage = message.customType === 'SENDBIRD_DESK_ADMIN_MESSAGE_CUSTOM_TYPE';
    message.isAssigned = data?.type === SendBirdDesk.Message.DataType.TICKET_ASSIGN;
    message.isTransferred = data?.type === SendBirdDesk.Message.DataType.TICKET_TRANSFER;
    message.isClosed = data?.type === SendBirdDesk.Message.DataType.TICKET_CLOSE;
    const isFirstJoinedAutoMessage =
      message.customType === 'SENDBIRD:AUTO_EVENT_MESSAGE' &&
      data?.type === 'USER_JOIN' &&
      data?.users.some((user) => user.user_id === sendbird.currentUser.userId);

    return (
      !message.isSystemMessage &&
      !message.isAssigned &&
      !message.isTransferred &&
      !message.isClosed &&
      !isFirstJoinedAutoMessage
    );
  } catch {
    return true;
  }
}

export function isFAQBotAnswer(message) {
  try {
    const messageData = JSON.parse(message.data);
    return (
      messageData.type === 'SENDBIRD_DESK_BOT_MESSAGE_FAQ_ANSWERS' &&
      messageData.results &&
      messageData.results.length > 0
    );
  } catch (error) {
    return false;
  }
}
