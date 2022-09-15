import TypingIndicatorComponent from '../components/ChatMessage/TypingIndicator';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'TypingIndicator',
  component: TypingIndicatorComponent,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <TypingIndicatorComponent {...args} />;

export const TypingIndicator = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TypingIndicator.args = {};
