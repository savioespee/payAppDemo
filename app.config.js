export default {
  name: 'SendFood Demo',
  description: 'Sales vertical demo, on-demand',
  slug: 'SendFood-demo',
  version: '1.0.2',
  orientation: 'portrait',
  icon: './assets/appFoodLogo.png',
  owner: 'sales-demo',
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
    bundleIdentifier: 'com.sendbird.salesdemo.sendfood',
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
