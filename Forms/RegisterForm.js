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
import validateNumber from "../Lib/Number";
import { MARCA } from "../Constans/Imagenes";

export default function LoginForm({ navigation, signIn }) {
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [nombre, setNombre] = useState();
  const [apellidos, setApellidos] = useState();
  const [telefono, setTelefono] = useState();
  const [error, setError] = useState(false);
  const [msgError, setmsgError] = useState("");

  const obtenerUser = async () => {
   /* const id_user = await AsyncStorage.getItem("id_user");
    if (id_user) navigation.navigate("app");*/
  };
  obtenerUser();


  const handleRegister = async () => {
    //navigation.navigate("SignIn");
   
    if (telefono && nombre && apellidos) {
      setError(false);
      if (validateNumber(telefono)) {
        setError(false);
        // 

        const persona = {
          name: nombre,
          last_name: apellidos,
          phone: telefono,
          type_persona: 1,
        };


        const response = await API.get(
          `accounts/?phone=${telefono}&format=json`
        );
        if(response.data.length==0){
          console.log("prueba")
          setIsVisibleLoading(true);
          const regis =  await API.post(`accounts/`, persona);
          setIsVisibleLoading(false);
          console.log(regis.data.id)
      
         navigation.navigate("SignIn");

        }else{
        console.log("Telefono ya existe")
          setIsVisibleLoading(false);
        }
        

      } else {
        setError(true);
        setmsgError("Teléfono inválido");
      }
    } else {
      setmsgError("Complete el formulario");
      setError(true);
    }


    setIsVisibleLoading(false);
  };


  return (
    <ImageBackground
      source={MARCA.FONDO_LOGIN}
      style={{ flex: 1, width: null, height: 900 }}
      resizeMode="cover"
    >
      {/* <Center flex={1} px="2">
        <Image source={MARCA.LOGO} alt="logo" />
      </Center> */}
      <KeyboardAvoidingView
        h={{
          base: "620px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <VStack p="6" flex="1">
          <Input
            style={{ fontSize: 20, color: "white" }}
            placeholder="Nombre"
            mt="15"
            mb="10"
            variant="underlined"
            onChange={(e) => setNombre(e.nativeEvent.text)}
          />
           <Input
            style={{ fontSize: 20, color: "white" }}
            placeholder="Apellidos"
            mt="15"
            mb="10"
            variant="underlined"
            onChange={(e) => setApellidos(e.nativeEvent.text)}
          />
           <Input
            style={{ fontSize: 20, color: "white" }}
            placeholder="Teléfono"
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
            onPress={() => handleRegister()}
          >
            Registrarse
          </Button>
        </VStack>
        {/* <ErrorMessage text="Número de teléfono incorrecto" isVisible={error} /> */}
        <Loading text="Registrando" isVisible={isVisibleLoading} />
      </KeyboardAvoidingView>
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
