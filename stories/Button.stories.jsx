import Component from '../components/Button';

export default {
  title: 'Button',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Button',
  variant: 'primary',
  size: 'default',
  isLoading: false,
  rounded: false,
  disabled: false,
};

export const Secondary = Template.bind({});

Secondary.args = { ...Primary.args, variant: 'secondary' };
