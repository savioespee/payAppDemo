import Component from '../components/FAQArticles';

export default {
  title: 'FAQArticles',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const FAQArticles = Template.bind({});
FAQArticles.args = {
  items: [
    'What if I don’t have enough money in my account?',
    'How do I add funds to my account?',
    'What if I spend more than I have in my account?',
  ],
};
