import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "FoodLinks",
  slug: "foodlinks",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "foodlinks",
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
  },
  android: {
    runtimeVersion: {
      policy: "appVersion",
    },
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: "com.giuliano14.foodlinks",
    config: {
      googleMaps: {
        apiKey: process.env.google_maps_api_key,
      },
    },
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        newArchEnabled: true,
      },
    ],
    "expo-router",
    "expo-updates",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F4F7F2",
        android: {
          image: "./assets/images/logo-horizontal.png",
          imageWidth: 200,
        },
      },
    ],
    "@react-native-community/datetimepicker",
    "expo-maps",
    [
      "@react-native-google-signin/google-signin",
      {
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        androidClientId: "959023447340-pblakroae0tot8pu0vobnmqki7ki1cmp.apps.googleusercontent.com",
        iosUrlScheme: "com.googleusercontent.apps.959023447340-a13t5uk2lv9kespd975eit29ufbhk486",
      },
    ],
  ],
  updates: {
    url: "https://u.expo.dev/405443cb-b5cd-47cd-a6e1-813b20e200de",
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "405443cb-b5cd-47cd-a6e1-813b20e200de",
    },
  },
});
