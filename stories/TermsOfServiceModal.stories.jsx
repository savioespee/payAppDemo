import { SafeAreaProvider } from 'react-native-safe-area-context';

import Component from '../components/TermsOfServiceModal';

export default {
  title: 'TermsOfServiceModal',
  component: Component,
  decorators: [(storyFn) => <SafeAreaProvider>{storyFn()}</SafeAreaProvider>],
};

const Template = (args) => <Component {...args} />;

export const TermsOfServiceModal = Template.bind({});
TermsOfServiceModal.args = {
  isVisible: true,
};
