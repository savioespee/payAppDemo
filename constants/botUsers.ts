const bannerBot: BotUserInfo = {
  userId: '_ww_banner_bot',
  nickname: 'Banners',
  userType: 'official',
  avatarPath: '',
};

const reminders: BotUserInfo = {
  userId: '_ww_reminders_bot',
  nickname: 'Reminders',
  userType: 'official',
  avatarPath: '',
  brandAvatarType: 'notifications',
};

const notificationBot: BotUserInfo = {
  userId: '_ww_notification_bot',
  nickname: 'Notifications',
  userType: 'official',
  avatarPath: '',
};

const coachCarter: BotUserInfo = {
  userId: '_ww_coach_carter',
  nickname: 'Coach Carter',
  userType: 'friend',
  avatarPath: 'assets/avatars/coach-carter.png',
};

const promotions: BotUserInfo = {
  userId: '_ww_promotions_bot',
  nickname: 'Promotions',
  userType: 'official',
  avatarPath: '',
  brandAvatarType: 'promotions',
};

const camilla: BotUserInfo = {
  userId: '_ww_camilla',
  nickname: 'Camilla',
  userType: 'friend',
  avatarPath: 'assets/avatars/camilla.png',
};

const hailey: BotUserInfo = {
  userId: '_ww_hailey',
  nickname: 'Hailey',
  userType: 'friend',
  avatarPath: 'assets/avatars/camilla.png',
};

const sameer: BotUserInfo = {
  userId: '_ww_sameer',
  nickname: 'Sameer',
  userType: 'friend',
  avatarPath: 'assets/avatars/sameer.png',
};

const supportBot: BotUserInfo = {
  userId: '_ww_support_bot',
  nickname: 'Support Bot',
  userType: 'official',
  avatarPath: '',
  brandAvatarType: 'support',
};

const daniel: BotUserInfo = {
  userId: '_ww_daniel',
  nickname: 'Daniel',
  userType: 'supportAgent',
  avatarPath: 'assets/avatars/daniel.png',
};

const breethe: BotUserInfo = {
  userId: '_ww_breethe',
  nickname: 'Mindset with Breethe',
  userType: 'official',
  avatarPath: 'assets/avatars/breethe.png',
};

const liveEvents: BotUserInfo = {
  userId: '_ww_live_events',
  nickname: 'Live Events',
  userType: 'official',
  avatarPath: 'assets/avatars/live-events.png',
};

const jim: BotUserInfo = {
  userId: '_ww_jim',
  nickname: 'Jim',
  userType: 'friend',
  avatarPath: 'assets/avatars/jim.png',
};

const amanda: BotUserInfo = {
  userId: '_ww_amanda',
  nickname: 'Amanda',
  userType: 'friend',
  avatarPath: 'assets/avatars/amanda.png',
};

const ryan: BotUserInfo = {
  userId: '_ww_ryan',
  nickname: 'Ryan',
  userType: 'friend',
  avatarPath: 'assets/avatars/ryan.png',
};

const casey: BotUserInfo = {
  userId: '_ww_casey',
  nickname: 'Casey',
  userType: 'friend',
  avatarPath: 'assets/avatars/casey.png',
};

const _botUsers = {
  bannerBot,
  reminders,
  coachCarter,
  promotions,
  camilla,
  hailey,
  sameer,
  supportBot,
  daniel,
  breethe,
  liveEvents,
  notificationBot,
  jim,
  amanda,
  ryan,
  casey,
} as const;

export const botUsers = _botUsers as Record<keyof typeof _botUsers, BotUserInfo>;

type BotUsers = typeof botUsers;

export const botUserIds = Object.keys(botUsers).reduce((acc, key) => {
  acc[key] = botUsers[key as keyof BotUsers].userId;
  return acc;
}, {} as Record<keyof typeof botUsers, string>);
