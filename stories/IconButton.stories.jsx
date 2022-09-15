import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Component from '../components/IconButton';
import { colors } from '../constants';

export default {
  title: 'IconButton',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const WithChildren = Template.bind({});
WithChildren.args = {
  children: <MaterialIcons name="close" size={24} color={colors.text} />,
};

export const WithImage = Template.bind({});
WithImage.args = {
  source: require('../assets/ic-new-chat.png'),
  tintColor: true,
};
