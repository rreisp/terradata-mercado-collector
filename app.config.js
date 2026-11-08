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
      name: 'MERCADO COLLECTOR',
      slug: 'mercado-collector',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'mercado',
      userInterfaceStyle: 'automatic',
      newArchEnabled: true,

      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.terradata.mercado',
      },

      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/icon.png',
          backgroundColor: '#ffffff',
        },
        package: 'com.terradata.mercado',

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
          projectId: '1404efca-f924-456d-a036-8a9973dc1b78', // Rodrigo
          // projectId: 'b48d5b7e-d8f5-42cf-a97d-a18e2c41cb84', // Jeferson
        },

        // valor dinâmico AAAAMMDDHHmm
        buildStamp,
      },
    },
  };
};
