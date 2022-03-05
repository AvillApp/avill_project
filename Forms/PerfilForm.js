import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  KeyboardAvoidingView,
  Button
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PerfilForm({ navigation, signOut }) {

  const CerraCuenta = async () => {
    const id_user = await AsyncStorage.getItem("id_user");
    const remove = await AsyncStorage.removeItem("id_user");
    const id_user2 = await AsyncStorage.getItem("id_user");
    const id_pedido = await AsyncStorage.removeItem("pedido");
    
    if (!id_user2){ 
        signOut()
    }
  };
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
                
         <Button
            mb="2"
            colorScheme="red"
            key="lg"
            size="lg"
            variant="solid"
            onPress={() => CerraCuenta()}
          >
            Cerrar Sesión
          </Button>
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
