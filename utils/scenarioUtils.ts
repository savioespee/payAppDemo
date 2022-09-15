import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  getHours,
  getMinutes,
  parse,
  setHours,
  setMinutes,
  startOfMinute,
} from 'date-fns';
import { mapValues } from 'remeda';

import {
  addReaction,
  editMessage,
  fetchGroupChannels,
  getGroupChannel,
  sendMessage,
  updateGroupChannelMetaData,
} from '../api/platformAPI';
import { sendMessageAndTranslate } from '../api/utils';
import { scenario } from '../constants/scenario';
import { sendbird } from './sendbird';

export function getScenarioStateContext({
  userId,
  channelUrl,
}: {
  userId: string;
  channelUrl: string;
}): ScenarioStateContext {
  const scenarioStateContext: ScenarioStateContext = {
    channelUrl,
    setChannelMetaData: updateGroupChannelMetaData,
    transitionState: async (state: string) => {
      const { setChannelState } = await import('../api/ChannelStateUtils');
      setChannelState({ channelUrl, state: state, userId });
    },
    updateUserMessage: ({ channelUrl, messageId, payload }) =>
      editMessage(channelUrl, messageId, { message_type: 'MESG', ...payload }),
    async sendMessage({ channelUrl, message }) {
      // eslint-disable-next-line no-use-before-define
      const payload = convertScenarioMessageToMessagePayload(message, {
        myUserId: userId,
        channelMetaData: {},
      });
      if (channelUrl) {
        await sendMessage(channelUrl, payload);
        return;
      }
      if (message.sender) {
        const [targetChannel] = await fetchGroupChannels(userId, {
          members_exactly_in: [message.sender, userId].map(encodeURIComponent).join(','),
        });
        await sendMessage(targetChannel.channel_url, payload);
        return;
      }
      throw new Error('Channel URL or sender is required');
    },
  };

  return scenarioStateContext;
}

export async function handleChannelStateEvent<HandlerData>(
  handler:
    | ((data: HandlerData, context: ScenarioStateContext) => void)
    | ((context: ScenarioStateContext) => void)
    | undefined,
  params: HandlerData | undefined,
  channelContext: { channelUrl: string },
) {
  if (!handler) {
    return;
  }
  const { channelUrl } = channelContext;
  const scenarioStateContext = getScenarioStateContext({ channelUrl, userId: sendbird.currentUser.userId });

  const args = params ? [params, scenarioStateContext] : [scenarioStateContext];
  return (handler as any)(...args);
}

export const getScenarioDataFromCustomChannelType = (customChannelType: string) =>
  scenario.channels.find((c) => c.customType === customChannelType);

export async function getScenarioDataFromChannelUrl(channelUrl: string) {
  const channel = await getGroupChannel(channelUrl);
  return getScenarioDataFromCustomChannelType(channel.custom_type);
}

export const convertTimestamp = (timestamp: number | string | Date = 0) => {
  if (!timestamp) {
    return Date.now();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }

  if (typeof timestamp === 'string') {
    if (!isNaN(parse(timestamp, 'yyyy-MM-dd HH:mm:ss', new Date()).valueOf())) {
      return parse(timestamp, 'yyyy-MM-dd HH:mm:ss', new Date()).valueOf();
    }
    let result = new Date();
    timestamp.split(' ').forEach((token) => {
      if (!isNaN(parse(token, 'h:mmaa', new Date()).valueOf())) {
        const parsedDate = parse(token, 'h:mmaa', new Date());
        result = startOfMinute(setMinutes(setHours(result, getHours(parsedDate)), getMinutes(parsedDate)));
      } else if (!isNaN(parse(token, 'haa', new Date()).valueOf())) {
        const parsedDate = parse(token, 'haa', new Date());
        result = startOfMinute(setMinutes(setHours(result, getHours(parsedDate)), 0));
      } else if (token.endsWith('d')) {
        result = addDays(result, parseInt(token.slice(0, -1), 10));
      } else if (token.endsWith('h')) {
        const hours = parseInt(token.slice(0, -1), 10);
        result = addHours(result, hours);
      } else if (token.endsWith('m')) {
        const minutes = parseInt(token.slice(0, -1), 10);
        result = addMinutes(result, minutes);
      } else if (token.endsWith('s')) {
        const seconds = parseInt(token.slice(0, -1), 10);
        result = addSeconds(result, seconds);
      }
    });
    return result.valueOf();
  }

  return (timestamp as Date).valueOf();
};

function replaceVariables(value: string, context: { channelMetaData: Record<string, string> }) {
  const replaceTokens = (token: string) => {
    if (token.startsWith('{{') && token.endsWith('}}')) {
      const key = token.slice(2, -2);
      if (key.startsWith('channelMetaData.')) {
        const key2 = key.replace(/^channelMetaData\./, '');
        return context.channelMetaData[key2];
      }
    }
    return token;
  };
  const tokens = value.split(/(\{\{[A-Za-z0-9.]+\}\})/g);
  return tokens.map(replaceTokens).join('');
}

function replaceDataVariables(data: any, context: { channelMetaData: Record<string, string> }) {
  return mapValues(data, (value) => {
    if (typeof value === 'string') {
      return replaceVariables(value, context);
    } else if (typeof value === 'object') {
      return Array.isArray(value)
        ? value.map((v) => replaceDataVariables(v, context))
        : replaceDataVariables(value, context);
    } else {
      return value;
    }
  });
}

export function convertScenarioMessageToMessagePayload(
  scenarioMessage: SingleContentScenarioMessage,
  context: { myUserId: string; channelMetaData: Record<string, string> },
) {
  const { sender, content, createdAt, data, isSilent, customType } = scenarioMessage;
  const { myUserId, channelMetaData } = context;

  const commonProps = {
    created_at: convertTimestamp(createdAt) || undefined, // if createdAt is 0, send the message immediately
    is_silent: isSilent,
    custom_type: customType,
    data: data && JSON.stringify(replaceDataVariables(data, { channelMetaData })),
  };

  if (!sender) {
    // Send as admin message
    return {
      ...commonProps,
      message_type: 'ADMM' as const,
      message: replaceVariables(String(content), { channelMetaData }),
    };
  }

  const user_id = sender === 'ME' ? myUserId : sender;
  if (typeof content === 'object') {
    return {
      ...commonProps,
      user_id,
      message_type: 'FILE' as const,
      url: content.url,
      file_type: content.type,
    };
  } else {
    return {
      ...commonProps,
      user_id,
      message_type: 'MESG' as const,
      message: replaceVariables(content, { channelMetaData }),
    };
  }
}

export function convertMessagesToPayloadArray__TMP(messages: ScenarioDataChannelState['messages'] = []) {
  return messages
    .flatMap((message) => {
      const singleContentMessages = (
        Array.isArray(message.content) ? message.content.map((content) => ({ ...message, content })) : [message]
      ) as (Omit<ScenarioMessage, 'content'> & { content: MessageContent })[];
      return singleContentMessages;
    })
    .map(({ createdAt, ...rest }) => ({ ...rest, createdAt: convertTimestamp(createdAt) }))
    .map((item, index, array) => {
      if (array[index - 1]?.createdAt === item.createdAt) {
        // If the consecutive messages have the same timestamp, we need to add a delay to the next message to keep the order.
        const { createdAt, ...rest } = item;
        return { ...rest, createdAt: createdAt + 1 };
      }
      return item;
    });
}

export const addReactionsToMessage = async ({
  channelUrl,
  messageId,
  reactions,
}: {
  channelUrl: string;
  messageId: number;
  reactions?: Reaction[];
}) => {
  await Promise.all(
    reactions?.map(({ emoji, userIds }) =>
      userIds.map((userId) => addReaction({ channelUrl, messageId, reaction: emoji, userId })),
    ) ?? [],
  );
};

export const requestSendMessage = async (
  message: SingleContentScenarioMessage,
  {
    myUserId,
    channelMetaData,
    channelUrl,
  }: { myUserId: string; channelMetaData: Record<string, string>; channelUrl: string },
) => {
  const sendMessagePayload = convertScenarioMessageToMessagePayload(message, {
    myUserId,
    channelMetaData,
  });
  const newMessage = await sendMessageAndTranslate(channelUrl, sendMessagePayload);
  await addReactionsToMessage({ channelUrl, messageId: newMessage.message_id, reactions: message.reactions });
};
