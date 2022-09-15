# Publishing to Expo Go
Running `expo publish` will publish the app to Expo Go.
## Before publishing your app
Open `app.config.js` and:
- Set `name` properly. This will be a display name of the app.
- Make sure `slug` doesn’t overlap with the slugs of your other published apps.
- Set `owner` to the name of your Expo account or your Expo organization.
- Update `assets/icon.png` which will be the app icon.
- Update `ios.bundleIdentifier` properly.

To learn more about `app.config.js`, refer to [Expo Docs](https://docs.expo.dev/versions/latest/config/app/).

## Sharing the app with others
After publishing your app, you can copy the URL of the app from Expo Go. 
### iOS
For iOS, you must create an Expo organization and invite the people who need access to the app to your organization. They need to create an Expo account, too.

After creating an organization, you need to change the `owner` of `app.config.js` to the name of the organization, and republish the app.

### Android
For Android, sharing a URL should work as long as Expo Go is installed on their device and the project you’re sharing is not hidden in the project settings.

