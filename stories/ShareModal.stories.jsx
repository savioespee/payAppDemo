import { SafeAreaProvider } from 'react-native-safe-area-context';

import Component from '../components/ShareModal';
import { botUserIds } from '../constants';

export default {
  title: 'ShareModal',
  component: Component,
  decorators: [(storyFn) => <SafeAreaProvider>{storyFn()}</SafeAreaProvider>],
};

const Template = (args) => <Component {...args} />;

const daniel = {
  userId: botUserIds.daniel,
  nickname: 'Daniel',
  profileUrl:
    'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/avatars/daniel.png',
};
const grace = {
  userId: botUserIds.grace,
  nickname: 'Grace',
  profileUrl:
    'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/avatars/grace.png',
};
const robin = {
  userId: botUserIds.robin,
  nickname: 'Robin',
  profileUrl:
    'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/avatars/robin.png',
};
const angela = {
  userId: botUserIds.angela,
  nickname: 'Angela',
  profileUrl:
    'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/avatars/angela.png',
};

export const ShareModal = Template.bind({});
ShareModal.args = {
  title: 'Split the cost with',
  isVisible: true,
  shareTargets: [
    daniel,
    grace,
    robin,
    angela,
    {
      url: 'CHANNEL_URL',
      name: 'Pine Street Friends',
      coverUrl: '',
      members: [
        daniel,
        angela,
        robin,
        {
          userId: 'alex',
          nickname: 'Alex',
          profileUrl:
            'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/avatars/alex.png',
        },
      ],
    },
  ],
};
