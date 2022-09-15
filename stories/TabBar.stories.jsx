import TabBarComponent from '../components/TabBar';

export default {
  title: 'TabBar',
  component: TabBarComponent,
};

const Template = (args) => <TabBarComponent {...args} />;

export const TabBar = Template.bind({});
TabBar.args = {
  state: {
    index: 0,
    routes: [
      { key: 'inbox', name: 'Inbox' },
      { key: 'people', name: 'People' },
      { key: 'explore', name: 'Explore' },
    ],
  },
  descriptors: {
    inbox: { options: {} },
    people: { options: {} },
    explore: { options: {} },
  },
};
