import { sendbird } from '../../utils/sendbird';

export default function isMyMessage(item: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage) {
  if (item.isAdminMessage()) {
    return false;
  }
  return item.sender?.userId === 'STORYBOOK_USER_ID' || item.sender?.userId === sendbird.currentUser?.userId;
}
