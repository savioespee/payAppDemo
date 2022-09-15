export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const argTypes = {};

export const args = {};

export const decorators = [
  (Story, context) => {
    return <Story />;
  },
];
