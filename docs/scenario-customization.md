# Customizing the scenario
The scenario object in `constants/scenario.ts` defines the automated conversations between the current user and the bots. 

The scenario consists of multiple channels, and each channel has its members, name, custom type, and states. Every channel has its initial state that includes its initial messages. As a user interacts with the demo, a channel can transition into another state showing new messages and suggested replies, which is also defined in the scenario object.

## Scenario object interfaces
### `ScenarioData`
- `key`: Unique key of the scenario
- `defaultLanguage`: User’s default language. Some text including the chat messages will be translated based on the user’s language selection.
- `userProfile`: User’s information
- `channels`: User’s channels

### `ChannelScenario`
- `members`: User IDs of the channel members other than the current user
- `name`: Name of the channel
- `customType` Custom type of the the channel
- `initialReadAt`: Initial read timestamp to show the initial read status properly.
- `states.initial`: Defines the initial messages of the channel.
- `state`: Defines all states the channel.

### `ScenarioDataChannelState`
- `messages`: Messages to be sent when the channel transitions to the state.
- `suggestedReplies`: Suggested replies to show above the chat input. Each reply can have a destination state. When a user selects a reply item, the channel will transition to its destination state.
- `after`: When defined, a state transition will occur immediately or specific seconds after sending the messages of the state.
- `showPinPad`: If true, a number pad screen will show up when the channel transitions to this state.
- Event handlers (`onEntry`, `onCarouselSelect`, `onActionPress`, …, whose name starts with `on`): Defines the behavior when some events happen. For example, you can transition to the next state when a specific action is pressed by a user.

### `ScenarioMessage`
- `sender`: Sender’s user ID. There are some special keywords.
	- `"ME"`: The message will be sent by the current user.
	- `null`: The message will be an admin message without a sender.
- `content`: Content of the message. It can be a string, a file object, or an array of them when the same sender should send multiple messages consequently.
- `reactions`: Reactions to add to the message
- `createdAt`: Timestamp of the message
- `data`: A data object to render a rich content message

## Changing the scenario
### Interpolating variables into messages
If some messages should be changed based on the current user’s selections, you can store them in the channel metadata and interpolate them into a message. For example, this message content will change based on the channel metadata.

```
"You purchased {{channelMetaData.selectedProduct}}."
```

### Specifying timestamps
Message timestamps and the initial read timestamp of a channel can be set in different ways.

1. `0`: Current time
2. `number`: UNIX timestamp in milliseconds
3. `"yyyy-MM-dd HH:mm:ss"`: Date and time (e.g. `2022-09-01 12:34:00`)
4. `"Nd h:mmaa"`: Relative day and time (e.g. `-5d 10:30am`)
5. `"Nd haa"`: Relative day and hour (e.g. `-2d 12pm`)
6. `"Nd Nh Nm Ns"`: Relative time from the current time (e.g. `-2h -30m`)

### Applying changes after updating the scenario
Updating the scenario object won’t update the existing messages automatically. You need to reset the user to clear the old messages by pressing the reset button on `SettingsScreen`.

If you already published the app to Expo Go, and want to clear the old messages of those who already had access to your app, bump up the `USER_VERSION` in `constants/index.ts`. Then, the next time they open the app, the current user will be automatically reset.
