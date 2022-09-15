export const getInboxItemChannel = (item: InboxItem) => {
  switch (item.inboxItemType) {
    case 'channel':
      return item.channel;
    default:
      throw new Error(`Unexpected inbox item type: ${item.inboxItemType}`);
  }
};

const getInboxItemTimestamp = (item: InboxItem) => {
  const channel = getInboxItemChannel(item);
  const lastMessage = channel.lastMessage;
  return lastMessage ? lastMessage.createdAt : channel.createdAt;
};

export const sortInboxItems = (items: InboxItem[]) => {
  return [...items].sort((a, b) => getInboxItemTimestamp(b) - getInboxItemTimestamp(a));
};
