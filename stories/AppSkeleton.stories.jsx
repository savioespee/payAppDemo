import Component from '../components/AppSkeleton';

export default {
  title: 'AppSkeleton',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const AppSkeleton = Template.bind({});
AppSkeleton.args = {};
