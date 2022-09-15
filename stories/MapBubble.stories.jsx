import Component from '../components/bubbles/MapBubble';

export default {
  title: 'MapBubble',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const MapBubble = Template.bind({});
MapBubble.args = { title: 'ETA 20 minutes' };
