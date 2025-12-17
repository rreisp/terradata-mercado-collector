import { withAndroidManifest } from '@expo/config-plugins';

export default () => {
  const now = new Date();

  // AAAAMMDDHHmm
  const buildStamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');

  return {
    expo: {
      name: 'CAPTUREWISE',
      slug: 'capture-wise',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'capturewise',
      userInterfaceStyle: 'automatic',
      newArchEnabled: true,

      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.terradata.capturewise',
      },

      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/icon.png',
          backgroundColor: '#ffffff',
        },
        package: 'com.terradata.capturewise',

        // Mantido por clareza (Expo-level)
        largeHeap: true,
      },

      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
      },

      plugins: [
        // 🔐 Plugin GARANTIDO para largeHeap
        (config) =>
          withAndroidManifest(config, (config) => {
            const application =
              config.modResults.manifest.application?.[0];

            if (application) {
              application.$['android:largeHeap'] = 'true';
            }

            return config;
          }),

        'expo-router',

        [
          'expo-splash-screen',
          {
            image: './assets/images/splash-icon.png',
            imageWidth: 200,
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
          },
        ],

        'expo-web-browser',
        'expo-sqlite',
        'expo-mail-composer',
      ],

      experiments: {
        typedRoutes: true,
      },

      extra: {
        router: {},
        eas: {
          projectId: '1404efca-f924-456d-a036-8a9973dc1b78',
        },

        // valor dinâmico AAAAMMDDHHmm
        buildStamp,
      },
    },
  };
};
