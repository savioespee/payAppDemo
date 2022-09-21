import { messageCustomTypes, translationTargetLanguages } from '../constants';
import delay from '../utils/delay';
import { editMessage, markAsRead, sendMessage } from './platformAPI';

export async function sendMessageAndTranslate(...params: Parameters<typeof sendMessage>) {
  const [channelUrl, options] = params;
  const message = await sendMessage(channelUrl, {
    ...options,
    translations: translationTargetLanguages,
  });
  return message;
}

export const typeAndSendMessage = async ({
  channelUrl,
  userId,
  typingDuration = 1000,
  messageParams,
}: {
  channelUrl: string;
  userId: string | null;
  typingDuration?: number;
  messageParams: Parameters<typeof sendMessageAndTranslate>[1];
}) => {
  if (userId) {
    await markAsRead(userId, channelUrl);
  }

  if (messageParams.message_type === 'MESG') {
    const { message_id: messageId } = await sendMessageAndTranslate(channelUrl, {
      message_type: 'MESG',
      custom_type: messageCustomTypes.typingIndicator,
      user_id: userId,
      message: 'Typing...',
      created_at: messageParams.created_at,
    });
    await delay(typingDuration);
    return editMessage(channelUrl, messageId, {
      ...messageParams,
      custom_type: messageParams.custom_type || '',
    });
  } else {
    return sendMessageAndTranslate(channelUrl, messageParams);
  }
};
