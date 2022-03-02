import React, { useState } from "react";
import { ImageBackground, Platform, StyleSheet } from "react-native";
import {
  Center,
  Image,
  Input,
  KeyboardAvoidingView,
  VStack,
  Text,
  Button,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../Lib/Loading";
import API from "../Lib/Db";
import { MARCA } from "../Constans/Imagenes";

export default function LoginForm({ navigation, signIn }) {
  const [telefono, setTelefono] = useState();
  const [clave, setClave] = useState(""); //
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [error, setError] = useState(false);

  const obtenerUser = async () => {
    const id_user = await AsyncStorage.getItem("id_user");
    const id_pedido = await AsyncStorage.getItem("id_pedido");
    if (id_user) // console.log("Va a iniciar sesion ") 
      signIn();
  };
  obtenerUser();

  const Loguear = async (id, nom, ape, token) => {
   // console.log("info: ", id);
    await AsyncStorage.setItem("id_user", id.toString());
    await AsyncStorage.setItem("nombre", nom.toString());
    await AsyncStorage.setItem("apellidos", ape.toString());

    const lat = await AsyncStorage.getItem("latitude");
    const long = await AsyncStorage.getItem("longitude");

    if(token!=='')
      token = "null"

    const payload = {
      tokenPush: token,
      name: nom,
      last_name: ape,
      longitude: long,
      latitude: lat,
    };

    // Actualizamos cuenta con nuevas coordenadas
    await API.put(`accounts/${id}/`, payload);
    signIn();
  };

  const autentication = async () => {
    const tokenPush = await AsyncStorage.getItem("tokenPush");

    if(telefono){
    
      const response = await API.get( 
        `accounts/?phone=${telefono}&type_persona=1&format=json`
      );

      if(response.data.length>0){
        setIsVisibleLoading(true);
        response.data.map((dt) => {
          data = dt.id;
          nom = dt.name;
          ape = dt.last_name;
        });
        Loguear(data, nom, ape, tokenPush);
        setIsVisibleLoading(false);
      }
      

    }
    
    
  };


  return (
    <ImageBackground
      source={MARCA.FONDO_LOGIN}
      style={{ flex: 1, width: null, height: 900 }}
      resizeMode="cover"
    >
      <Center flex={1} px="2">
        <Image source={MARCA.LOGO} alt="logo" />
      </Center>

      {/* <KeyboardAvoidingView
        h={{
          base: "420px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
       <>
        <VStack p="6" flex="1">
          <Input
            style={{ fontSize: 20, color: "white" }}
            placeholder="Número de teléfono"
            mt="15"
            mb="10"
            variant="underlined"
            onChange={(e) => setTelefono(e.nativeEvent.text)}
          />
          <Button
            mb="10"
            colorScheme="yellow"
            key="lg"
            size="lg"
            variant="solid"
            onPress={() => autentication()}
          >
            Ingresar
          </Button>
          <Center>
            <Text
              style={styles.txt}
              onPress={() => navigation.navigate("SignUp")}
            >
              ¿No tienes una cuenta?
            </Text>
            <Text style={styles.txt}>Política y Términos y Condiciones</Text>
          </Center>
        </VStack>
        {/* <ErrorMessage text="Número de teléfono incorrecto" isVisible={error} /> */}
        <Loading text="Iniciando sesión" isVisible={isVisibleLoading} />
      {/* </KeyboardAvoidingView> */}
      </>
    </ImageBackground>
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
    alignItems: "center",
    fontSize: 18,
  },
});
