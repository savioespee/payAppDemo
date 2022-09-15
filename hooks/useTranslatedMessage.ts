import { useCallback } from 'react';

import { messageCustomTypes } from '../constants';
import { scenario } from '../constants/scenario';
import useCurrentUserLanguage from './useCurrentUserLanguage';

export default function useTranslatedMessage() {
  const language = useCurrentUserLanguage();
  return useCallback(
    (message: Message) => {
      if (message.isFileMessage()) {
        return '';
      }
      if (message.customType === messageCustomTypes.interactiveResponse) {
        const suggestedReplyMessages = scenario.channels
          .flatMap((channel) => Object.values(channel.states).flatMap((state) => state.suggestedReplies || []))
          .map((replyItem) => (Array.isArray(replyItem) ? replyItem[0] : replyItem));

        const matchingSuggestedReply = suggestedReplyMessages.find((replyMessage) => {
          const englishMessage = typeof replyMessage === 'string' ? replyMessage : replyMessage.en;
          return englishMessage === message.message;
        });

        if (matchingSuggestedReply && typeof matchingSuggestedReply === 'object') {
          return matchingSuggestedReply[language];
        }
      }

      const translatedMessage = message.translations?.[language];
      return (translatedMessage || message.message || '').trim();
    },
    [language],
  );
}
