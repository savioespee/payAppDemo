import { ImageRequireSource } from 'react-native';
import SendBird from 'sendbird';

import type Emoji from './api/platformAPI/emoji.json';

declare global {
  type BotUserType = 'friend' | 'store' | 'stock' | 'supportAgent' | 'official';
  type BrandAvatarType = 'notifications' | 'support' | 'delivery' | 'promotions' | 'sales';

  type BotUserInfo = {
    userId: string;
    nickname: string;
    avatarPath: string;
    updateUserInfo?: boolean;
    userType: BotUserType;
    brandAvatarType?: BrandAvatarType;
  };

  type Message = SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage;

  type InboxItem = {
    inboxItemType: 'channel';
    channel: SendBird.GroupChannel;
    recentMessages?: Message[];
  };

  type AppTheme = {
    accent: string;
    announcementBarBackgroundDefault: string;
    announcementBarBackgroundHover: string;
    announcementBarIcon: string;
    announcementBarContent: string;
    brandAvatarBackground: string;
    brandAvatarIcon: string;
    activeTab: string;
    inactiveTab: string;
    primaryButtonBackgroundDefault: string;
    primaryButtonBackgroundHover: string;
    primaryButtonContent: string;
    suggestedReplyBackgroundDefault: string;
    suggestedReplyBackgroundHover: string;
    suggestedReplyText: string;
    adminMessageBoxBackground: string;
    csatSelectedItemBackground: string;
    outgoingMessageBackground: string;
    outgoingMessageText: string;
    navigationTintColor: string;
  };

  type MessageActionVariant = 'default' | 'dark' | 'light' | 'translucent-light';
  type MessageAction = {
    label: string;
    variant?: MessageActionVariant;
    url?: string;
    channelCustomType?: string;
  };

  type MessageTranslations = { en: string; ko: string; es: string;  zh: string}; //zh: string;

  type CarouselItem = {
    type: 'image' | 'text';
    name: string;
    localImageName?: string;
    price?: string;
    isSelected?: boolean;
    buttonLabel?: string;
    backgroundColor?: string;
  };

  type MessageData = {
    /** Header to show with a warning icon inside a message bubble */
    header?: {
      title: string;
      type:
        | 'bookmark'
        | 'warning'
        | 'announcement'
        | 'card'
        | 'people'
        | 'tip'
        | 'tag'
        | 'news'
        | 'stock'
        | 'bank'
        | 'reminder'
        | 'promotions'
        | 'ww';
    };

    /** Actions to show inside a message bubble */
    actions?: MessageAction[];

    /** Background color of the chat bubble */
    backgroundColor?: string;

    /** Local image name of a banner */
    localImageName?: string;

    /** Cover image of a message bubble */
    cover?: string;
    coverAspectRatio?: number;

    /** Custom type of the channel to navigate when a banner is pressed */
    channelCustomType?: string;

    /** Web URL to navigate when a banner is pressed */
    url?: string;

    /** Vote options - only effective when custom type is "vote". Voting is disabled if `isSelected` of any item is true */
    carousel?: {
      key: string;
      options: CarouselItem[];
    };

    /** FAQ articles to display under message bubble */
    faqArticles?: string[];

    /** CSAT: -1(Bad), 0(Not scored), 1(Great) */
    csat?: -1 | 0 | 1;

    /** Order info - only displayed when custom type is "orderConfirmation" */
    orderInfo?: {
      price: string;
      product: string;
      paymentMethod: string;
      address?: string;
      localImageName: string;
      title: string;
    };

    /** Split payment info - only effective when custom type is `splitPayment` */
    splitPayment?: {
      totalAmount: number;
      pendingPaymentCount: number;
      sender: { nickname: string; profileUrl: string; userId: string };
    };

    /** Render text as markdown */
    isMarkdown?: boolean;

    /** Text to show in the channel list */
    previewText?: string;

    /** Title of content card */
    title?: string;

    audio?: {
      title: string;
      category: string;
      duration: string;
      backgroundColor: string;
      image: string;
    };
  };

  type ChannelData = {
    flightType: 'current' | 'complete' | 'upcoming';
    flightDestination: string;
  };

  type FileContent = { type: string; url: string };
  type MessageContent = string | FileContent;

  type TimestampRepresentation = number | string;

  type Reaction = { emoji: Emoji; userIds: string[] };

  type ScenarioMessage = {
    sender: string | null;
    content: MessageContent | MessageContent[];
    customType?: string;
    data?: MessageData;
    createdAt?: TimestampRepresentation;
    reactions?: Reaction[];
    isSilent?: boolean;
  };

  type SingleContentScenarioMessage = Omit<ScenarioMessage, 'content'> & {
    content: MessageContent;
  };

  type ScenarioStateContext = {
    channelUrl: string;
    setChannelMetaData: (params: { channelUrl: string; metaData: Record<string, string> }) => void;
    updateUserMessage: (params: {
      channelUrl: string;
      messageId: number;
      payload: { message?: string; data?: string };
    }) => void;
    sendMessage: (params: { channelUrl?: string; message: SingleContentScenarioMessage }) => void;
    transitionState: (state: string) => void;
  };

  type SuggestedReplyMessage = string | Record<string, string>;
  type SuggestedReplyItem = SuggestedReplyMessage | [SuggestedReplyMessage, string];

  type ChannelStateHandlerKey =
    | 'onChannelEnter'
    | 'onCarouselSelect'
    | 'onActionPress'
    | 'onPinCodeSubmit'
    | 'onCSATSelect'
    | 'onEntry';

  type ScenarioDataChannelState = {
    messages?: ScenarioMessage[];
    showPinPad?: boolean;
    suggestedReplies?: SuggestedReplyItem[];
    after?: { delay?: number; targetState: string };
    onEntry?: (context: ScenarioStateContext) => void;
    onChannelEnter?: (context: ScenarioStateContext) => void;
    onCarouselSelect?: (
      data: { selectedOption: CarouselItem; message: SendBird.UserMessage },
      context: ScenarioStateContext,
    ) => void;
    onActionPress?: (
      data: { action: MessageAction; message: SendBird.UserMessage },
      context: ScenarioStateContext,
    ) => void;
    onPinCodeSubmit?: (data: { code: string }, context: ScenarioStateContext) => void;
    onCSATSelect?: (data: { score: -1 | 0 | 1; message: SendBird.UserMessage }, context: ScenarioStateContext) => void;
  };

  type ChannelScenario = {
    members: string[];
    name: string;
    coverUrl?: string;
    isFrozen?: boolean;
    customType?: string;
    states: Record<string, ScenarioDataChannelState>;
    initialReadAt?: TimestampRepresentation;
  };

  type ScenarioData = {
    key: string;
    userProfile: { nickname: string };
    defaultLanguage: string;
    channels: ChannelScenario[];
  };
}
