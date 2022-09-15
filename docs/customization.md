# How to customize the demo
## Connecting the demo with a new application
Create a new application from the [dashboard](~dashboard.sendbird.com~).

On the dashboard, go to **Settings > Chat > Features** and turn on the features below.

* Auto-thumbnail generator
* Translation tools
* Moderation dashboard
* Other features you want to present during the demo

Go to **Settings > Application > General**, and get an API token. Replace `APP_ID` and `API_TOKEN` in `constants/common.ts` with your application values.

*Warning: Although Expo supports the web platform, you should not share the web version of the demo with others because the API token will be exposed in the client source code.*

Visit [SOJU](~soju.sendbird.com~) and update the application attributes below.
| Attribute                  | Value |
|----------------------------|-------|
| `item_limit.user_metadata` | 50    |
| `reactions`                | ON    |

To create application users who participate in automated conversations, run `yarn create-users` at the root of the project.

Run `yarn start` to run Expo CLI. Press `i` to run the demo on an iOS Simulator, or `a` to run it on an Android Virtual Device. To run it on your device, install the Expo Go app from App Store/Play Store and scan the QR code displayed by Expo CLI. Your computer and the device must be connected to the same network.

Go to **Group channels > Group** on the dashboard to check the group channels created for the new demo user.

## Customizing the entry to the Inbox screen
This project uses [React Navigation](https://reactnavigation.org/) to define the navigation structure of the app and routing between screens.

These are some main screens that are not likely to change.

- `RootScreen` is the first screen shown to a user, and where the navigation structure is defined.
- `InboxScreen` is the screen that lists the current user’s group channels.
- `ChatScreen` is the screen where a user can view and send messages in a group channel.
- `SettingsScreen` is the screen showing the current user’s ID and the reset button that will remove all of the user’s group channels and reinitialize them.

To define a pressable area that links to another screen, you can use `useNavigation` with `Pressable` component.

```tsx
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Pressable, Text } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  
  return (
    <View>
      <Pressable onPress={() => navigation.navigate('Inbox')}>
        <Text>Press me!</Text>
      </Pressable>
    </View>
  );
}
```

The simplest way to create some entry screens to the `InboxScreen` would be using a few screen images and hotspots that link to another screen. For that example, please refer to `screens/RootScreen.Screenshots.tsx`.
## Customizing appearance
### Customizing the theme
`constants/theme.ts` defines the colors that are shared across the app.

| Variable                          | Description                                                  |
|-----------------------------------|--------------------------------------------------------------|
| `accent`                          | Similar to the primary color of the app. It will be the color of a progress view, the send button, the typing indicator, etc. |
| `navigationTintColor`             | The default color of the buttons on the navigation bar       |
| `brandAvatarBackground`           | The background color of a brand avatar. The group channels with some special types like `notifications`, `support`, etc. will be shown with an avatar with a proper icon. For more details, refer to `components/BrandAvatar.tsx`. |
| `brandAvatarIcon`                 | The icon color of a brand avatar                             |
| `outgoingMessageBackground`       | The background color of the chat bubbles sent by the current user |
| `outgoingMessageText`             | The text color of the chat bubbles sent by the current user  |
| `suggestedReplyBackgroundDefault` | The background color of suggested replies that a user can choose from, listed above the chat input if exist. |
| `suggestedReplyBackgroundHover`   | The background color of suggested replies when the mouse cursor is hovering over it. (for the web version) |
| `suggestedReplyText`              | The text color of suggested replies                          |

For the other theme variables, please find its name across the project to see their usage.

## Customizing the scenario
Refer to [scenario-customization.md](scenario-customization.md).

