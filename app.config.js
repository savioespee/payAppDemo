
export default {
  name: 'SendFood',
  description: 'Sales vertical demo, SendFood',
  slug: 'SendFood-demo-app',
  version: '1.0.6',
  orientation: 'portrait',
  icon: './assets/appFoodLogo.png',
  owner: 'sb-demo_app',
  userInterfaceStyle: 'light',
  extra: { apiHost: process.env.API_HOST },
  plugins: ['@config-plugins/android-jsc-intl'],
  splash: {
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sendbird.salesdemoapp.sendfood',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/appFoodLogo.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/appFoodLogo.png',
  },
};
