import { translationTargetLanguages } from '../constants';
import delay from '../utils/delay';
import { markAsRead, sendMessage, startTypingIndicator, stopTypingIndicator } from './platformAPI';

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

  if (messageParams.message_type === 'MESG' && userId) {
    const startTime = Date.now();
    startTypingIndicator(channelUrl, [userId]);
    await delay(typingDuration - (Date.now() - startTime));
    stopTypingIndicator(channelUrl, [userId]);
  }
  return sendMessageAndTranslate(channelUrl, messageParams);
};
