import Component from '../components/BotResponseOptions';

export default {
  title: 'BotResponseOptions',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const BotResponseOptions = Template.bind({});
BotResponseOptions.args = {
  botResponseOptions: ['Option A', 'Option B'],
};
