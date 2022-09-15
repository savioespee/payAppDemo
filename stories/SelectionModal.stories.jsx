import Component from '../components/SelectionModal';

export default {
  title: 'SelectionModal',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const SelectionModal = Template.bind({});
SelectionModal.args = {
  options: ['English', 'Español', '한국어', 'Chinese'],//
  selectedOption: 'English',
  isVisible: true,
  title: 'Translate to',
  layout: 'actionSheet',
};
