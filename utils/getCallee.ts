import { sendbird } from "./sendbird";

export default async function getCallee(user_id: string) {
    const userListQuery = sendbird.createApplicationUserListQuery();
    userListQuery.userIdsFilter = [user_id];
    userListQuery.limit = 1;

    const [user] = await userListQuery.next();
    return user
  }