import { sendbird } from './sendbird';

export default async function getChannelUrlByCustomType(customType: string) {
  const listQuery = sendbird.GroupChannel.createMyGroupChannelListQuery();
  listQuery.customTypesFilter = [customType];
  listQuery.limit = 1;

  const [channel] = await listQuery.next();
  return channel.url;
}
