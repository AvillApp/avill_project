import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

import React, { useRef, useState, useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Center, VStack, Text, Button, NativeBaseProvider } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MARCA } from "./Constans/Imagenes";

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

export default function Localization({ Permiso }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  //Guardamos localización.
  const SaveLocation = async (lat, long) => {
    await AsyncStorage.setItem("latitude", lat.toString());
    await AsyncStorage.setItem("longitude", long.toString());

    //console.log("Coordenadsa: ", lat);
    if (lat) Permiso(true); // concender permiso.
  };

  const Loca = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      SaveLocation(location.coords.latitude, location.coords.longitude);
      return;
    } else console.log("No tiene permisos");
  };

  const SaveTokenPush = async (token) => {
    await AsyncStorage.setItem("tokenPush", token.toString());
    Loca();
  };
  const reviewing = async () => {

    console.log("Ingresó aquí")
    tokenReview = await AsyncStorage.getItem("tokenPush");
    //tokenReview = await AsyncStorage.setItem("tokenPush", "algo");
    locationReview = await AsyncStorage.getItem("latitude");
    
   // Loca();

    if (tokenReview && locationReview) Permiso(true); // concender permiso.
    else return false;
  };

  const Permitir = () => {
    reviewing(); // Revisamos si tiene token y ubica

    registerForPushNotificationsAsync().then((token) => {
      SaveTokenPush(token);
    });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log("Prueba")
      );
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  // Verificamos si tiene los permisos otorgados.

  useEffect(() => {
    Permitir();
  });

  return (
    <NativeBaseProvider>
      <ImageBackground
        source={MARCA.FONDO_LOGIN}
        style={{ flex: 1, width: null, height: 900 }}
        resizeMode="cover"
      >
        <>
          <VStack p="30" flex="3">
            <Center>
              <Text>{"\n"} </Text>
              <Text style={styles.txt}>
                Necesitamos tener permisos a tu ubicación para brindarte una
                mejor experiencia. Por medio de ella seremos más rápidos y
                precisos cuando solicites un servicio.
              </Text>

              <Text style={styles.txt}>
                Al permitir también aceptas nuestras Políticas de privacidad.{" "}
                {"\n"}
              </Text>
              <Text style={styles.txt}>Ver Política de privacidad {"\n"}</Text>

              <Button
                mb="30"
                mt="10"
                colorScheme="yellow"
                key="lg"
                size="lg"
                variant="solid"
                onPress={() => Permitir()}
              >
                Permitir Acceso
              </Button>
            </Center>
          </VStack>
        </>
      </ImageBackground>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  form: {
    marginTop: 40,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 90,
    marginTop: 100,
    height: 200,
    width: 200,
  },
  butt: {
    marginTop: 30,
    alignItems: "center",
    color: "#FFFFFF",
    fontSize: 15,
  },
  txt: {
    marginTop: 20,
    color: "#FFFFFF",
    alignItems: "baseline",
    fontSize: 18,
  },
});
