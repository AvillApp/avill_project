import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import React, { useRef, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Localization from "./Localization";
import Navigation from "./config/Navigation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
  const [conce, setConce] = useState(true);

  const Permiso = (id) => {
    setConce(id);
  };

  const SaveTokenPush = async (token) => {
    await AsyncStorage.setItem("tokenPush", token.toString());

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") Permiso(true);
    else Permiso(false);
  };

  useEffect(() => {
    //if (Device.isDevice && Platform.OS !== "web") {
    registerForPushNotificationsAsync().then((token) => {
      console.log("Prueba", token)

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
  });
  return <>{conce ? <Navigation /> : <Localization Permiso={Permiso} />}</>;
};
