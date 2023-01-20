export default {
  name: 'SendPay',
  description: 'Sales vertical demo, Fintech',
  slug: 'SendPay-demo-app',
  version: '1.0.1',
  orientation: 'portrait',
  icon: './assets/appPayLogo.png',
  owner: 'se-sandbox',
  //owner: 'sb-demo_app',
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
    bundleIdentifier: 'com.sendbird.sesandbox.sendpay',
    //bundleIdentifier: 'com.sendbird.salesdemoapp.sendpay',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/appPayLogo.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/appPayLogo.png',
  },
};
