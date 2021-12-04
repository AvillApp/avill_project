import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Location from "expo-location";

import Navigation from "./config/Navigation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}
export default () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  const SaveTokenPush = async (token) => {
    await AsyncStorage.setItem("tokenPush", token.toString());
  };

  const SaveLocation = async (lat, long) => {
    await AsyncStorage.setItem("latitude", lat.toString());
    await AsyncStorage.setItem("longitude", long.toString());
  };

  useEffect(() => {
    if (Constants.isDevice && Platform.OS !== "web") {
      registerForPushNotificationsAsync().then((token) => {
        SaveTokenPush(token);
      });
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) =>
          console.log(response)
        );
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso denegado");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      SaveLocation(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  return <Navigation />;
};
