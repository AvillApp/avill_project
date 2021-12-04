import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Center,
  Input,
  KeyboardAvoidingView,
  VStack,
  Text,
  Button,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import AppButton from "../Lib/AppButton";

import { MaterialIcons } from "@expo/vector-icons";
import Loading from "../Lib/Loading";
import ErrorMessage from "../Lib/Error";
import API from "../Lib/Db";
import { MARCA } from "../Constans/Imagenes";

export default function PortalForm({ navigation, signIn }) {
  const [searcLoc, setSarchLoc] = useState(false);
  const [ubicacion, setUbicacion] = useState({
    latitude: "",
    longitude: "",
  });
  const [Emision, setEmision] = useState();
  const [Direccion, setDireccion] = useState();

  const NuevoPedido = () => {
    const dir = Direccion;
    const emi = Emision;
    setDireccion("");
    setEmision("");

    navigation.navigate("Confirmar", {
      emision: emi,
      direccion: dir,
    });
  };

  const getSearch = async () => {
    const lat = await AsyncStorage.getItem("latitude");
    const long = await AsyncStorage.getItem("longitude");

    setUbicacion({
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
    });
    setSarchLoc(true);
  };

  useEffect(() => {
    if (!searcLoc) getSearch();
  }, [searcLoc]);
  return (
    <>
      <KeyboardAvoidingView
        h={{
          base: "400px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        styles={styles.fondo}
      >
        <VStack p="2" flex="1">
          <Input
            style={{ fontSize: 20, color: "black" }}
            placeholder="¿Dónde estas?"
            mt="15"
            mb="2"
            value={Emision}
            onChange={(e) => setEmision(e.nativeEvent.text)}
          />
          <Input
            style={{ fontSize: 20, color: "black" }}
            placeholder="¿Hacia dónde vamos?"
            mt="15"
            mb="5"
            value={Direccion}
            onChange={(e) => setDireccion(e.nativeEvent.text)}
          />
          <AppButton action={NuevoPedido} title="IR" />

          <Text>{"\n"}</Text>
          {ubicacion.latitude !== "" && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: ubicacion.latitude,
                longitude: ubicacion.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          )}
        </VStack>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  form: {
    marginTop: 40,
  },
  fondo: {
    backgroundColor: "white",
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
    alignItems: "center",
    fontSize: 18,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
