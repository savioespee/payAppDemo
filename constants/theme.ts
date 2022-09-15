import { darken } from 'polished';

const theme: AppTheme = {
  //accent: '#00018A',
  accent: '#6211C8',
  announcementBarBackgroundDefault: '#0050FE',
  announcementBarBackgroundHover: '#0050FE',
  announcementBarIcon: '#FFFFFF',  
  announcementBarContent: '#FFFFFF',
  brandAvatarBackground: '#DBD1FF',
  brandAvatarIcon: '#6211C8',
  activeTab: '#000586',
  inactiveTab: '#767676',
  // primaryButtonBackgroundDefault: '#000586',
  primaryButtonBackgroundDefault: '#6211C8',
  primaryButtonBackgroundHover: '#00046b',
  primaryButtonContent: '#6211C8',
  suggestedReplyBackgroundDefault: '#6211C8',
  suggestedReplyBackgroundHover: darken(0.2, '#00018A'),
  suggestedReplyText: '#FFFFFF',
  adminMessageBoxBackground: '#D1E1FF',
  // csatSelectedItemBackground: '#D1E1FF',
  csatSelectedItemBackground:  '#DBD1FF',
  //outgoingMessageBackground: '#D1E1FF',
  outgoingMessageBackground: '#DBD1FF',
  outgoingMessageText: 'rgba(0, 0, 0, 0.88)',
  navigationTintColor: '#6211C8',
};

export default theme;
