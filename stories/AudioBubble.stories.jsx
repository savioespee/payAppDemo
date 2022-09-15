import Component from '../components/bubbles/AudioBubble';

export default {
  title: 'AudioBubble',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const AudioBubble = Template.bind({});
AudioBubble.args = {
  message: {
    plainUrl:
      'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/uploads/voicememo.m4a',
  },
};
