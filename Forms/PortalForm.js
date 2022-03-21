import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Dimensions,
  View,
  Image,
} from "react-native";
import {
  Input,
  KeyboardAvoidingView,
  VStack,
  Text,
  Button,
} from "native-base";
import { MARCA } from "../Constans/Imagenes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PortalForm({ navigation, signIn }) {
  const [searcLoc, setSarchLoc] = useState(false);
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

    const id_pedido = await AsyncStorage.getItem("pedido");

    setSarchLoc(true);

    if (id_pedido){
      navigation.navigate("Estado", {
        pedido: id_pedido 
      });
    }
  };

  useEffect(() => {
    if (!searcLoc) getSearch();
  }, [searcLoc]);
  return (
    <>
      <KeyboardAvoidingView
        h={{
          base: "620px",
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

          <Button
            colorScheme="yellow"
            key="lg"
            size="lg"
            variant="solid"
            onPress={() => NuevoPedido()}
          >
            IR
          </Button>
          <Text>{"\n"}</Text>
          <View>
              <Image source={MARCA.FONDO_MAPA2} style={styles.logo} />
          </View>
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
    marginLeft: 60,
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
