import Component from '../components/ChatMessage/BillSplitting';

export default {
  title: 'BillSplitting',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const BillSplitting = Template.bind({});
BillSplitting.args = {
  sender: {
    nickname: 'Alex',
    profileUrl:
      'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/avatars/alex.png',
  },
  message:
    'Request to split the cost of "Chocolate Lovers Birthday Box - Gold"',
  totalAmount: 180,
  currency: '$',
  numberOfPeople: 4,
};
