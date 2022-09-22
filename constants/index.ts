import { channelCustomTypes, messageCustomTypes } from './common';

export * from './botUsers';
export * from './colors';
export * from './common';
export * from './localImageMap';

export const DEFAULT_MALE_PROFILE_URL = 'https://file-ap-2.sendbird.com/fec772585bee45a8b8bfedd960853dff.jpg';
export const DEFAULT_FEMALE_PROFILE_URL = 'https://file-us-3.sendbird.com/61b3540cce934d1cbf5eb1e980f63d15.jpg';

export const maskOptions = {
  precision: 0,
  separator: '.',
  delimiter: ',',
  unit: '$',
  suffixUnit: '',
};

export const tabs = {
  myday: 'My Day',
  rewards: 'Rewards',
  discover: 'Discover',
  inbox: 'Inbox',
};

export const TABLET_LANDSCAPE_WIDTH = 1024;
export const BUBBLE_PADDING = 12;

export const languageNames = {
  en: 'English',
  ko: '한국어',
  es: 'Español',
  zh: 'Chinese',
  // ta: 'Tamil',
};

export const asyncStorageKeys = {
  savedUser: 'savedUser',
  theme: 'theme',
};

export { channelCustomTypes, messageCustomTypes };

export const USER_METADATA_KEYS = {
  initializedVersion: 'initializedVersion',
  language: 'language',
  scenario: 'scenario',
  userType: 'userType',
  brandAvatarType: 'brandAvatarType',
} as const;

export const CHANNEL_METADATA_KEYS = {
  state: 'state',
} as const;

export const USER_VERSION = '0.0.30';

export const nonCenteredAdminMessageCustomTypes = [
  messageCustomTypes.splitPayment,
  messageCustomTypes.splitCost,
  messageCustomTypes.csat,
  messageCustomTypes.couldNotRecognize,
  messageCustomTypes.adminMessageBox,
  messageCustomTypes.adminMessageBubble,
];
