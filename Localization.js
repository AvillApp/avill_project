import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Center, VStack, Text, Button, NativeBaseProvider } from "native-base";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MARCA } from "./Constans/Imagenes";

export default function Localization({ Permiso }) {
  const [errorMsg, setErrorMsg] = useState(null);

  //Guardamos localización.
  const SaveLocation = async (lat, long) => {
    await AsyncStorage.setItem("latitude", lat.toString());
    await AsyncStorage.setItem("longitude", long.toString());

    if (lat) Permiso(true); // concender permiso.
  };

  const Permitir = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permiso denegado");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    SaveLocation(location.coords.latitude, location.coords.longitude);
  };

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
