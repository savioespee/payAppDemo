import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, View } from 'react-native';

import Component from '../components/ChatMessage';

const StoryBookStack = createStackNavigator();

export default {
  title: 'ChatMessage',
  component: Component,
  decorators: [
    (Story) => (
      <View style={Platform.OS === 'web' ? { height: '100vh' } : null}>
        <NavigationContainer>
          <StoryBookStack.Navigator>
            <StoryBookStack.Screen
              name="Chat"
              initialParams={{ channelUrl: 'CHANNEL_URL' }}
              component={() => <Story />}
              options={{ header: () => null }}
            />
          </StoryBookStack.Navigator>
        </NavigationContainer>
      </View>
    ),
  ],
};

const Template = (args) => <Component {...args} />;

export const ChatMessage = Template.bind({});
ChatMessage.args = {
  channel: {},
  message: {
    isUserMessage: () => true,
    isFileMessage: () => false,
    isAdminMessage: () => false,
    customType: '',
    message:
      'Hey Alex! I wanted to let you know we have some new birthday boxes about to be released that you can easily send to friends.',
    sender: { userId: 'STORYBOOK_USER_ID' },
  },
  isFirstMessageOfDay: false,
  isFollowingSameSender: false,
  isFollowedBySameSender: false,
  isTimestampVisible: true,
};
