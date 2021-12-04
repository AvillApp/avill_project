import React, { useState } from "react";
import {
  StyleSheet,
  AsyncStorage,
  View,
  Image,
  ImageBackground,
  Text,
} from "react-native";
import { Content, Form, Item, Input, Label, Icon } from "native-base";
import AppButton from "../Lib/plug/AppButton";
import Loading from "../Lib/plug/Loading";
import ErrorMessage from "../Lib/plug/Error";
import validateNumber from "../Lib/utils/Number";
import { MARCA } from "../Constans/imagenes";
import { api } from "../Lib/utils/db";
import axios from "axios";

export default function RegisterForm({ navigation }) {
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [nombre, setNombre] = useState();
  const [apellidos, setApellidos] = useState();
  const [telefono, setTelefono] = useState();
  const [error, setError] = useState(false);
  const [msgError, setmsgError] = useState("");

  const obtenerUser = async () => {
    const id_user = await AsyncStorage.getItem("id_user");
    if (id_user) navigation.navigate("app");
  };
  obtenerUser();

  const obtenerID = async () => {
    const infoUser = await fetch(
      `${api}personas/buscar/${telefono}?format=json`
    );
    const resUser = await infoUser.json();

    let data;
    resUser.map((dt) => {
      data = dt.id;
    });

    //console.log("información del ID: ", data)
    await AsyncStorage.setItem("id_user", data.toString());
    await AsyncStorage.setItem("nombre", nombre);

    navigation.navigate("app");
  };

  const handleRegister = async () => {
    setIsVisibleLoading(true);
    if (telefono && nombre && apellidos) {
      setError(false);
      if (validateNumber(telefono)) {
        setError(false);

        const persona = {
          name: nombre,
          last_name: apellidos,
          phone: telefono,
          type_persona: 1,
        };

        axios
          .post(`${api}personas/create/`, persona)
          .then((response) => {
            obtenerID();
          })
          .catch((error) => {
            setError(true);
          });
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
  const Login = () => {
    navigation.navigate("Login");
  };
  return (
    <Content
      ContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImageBackground
        source={MARCA.FONDO_LOGIN}
        style={{ flex: 1, width: null, height: 900 }}
        resizeMode="cover"
      >
        <View style={styles.centerLogo}>
          <Image source={MARCA.LOGO} style={styles.logo} />
        </View>
        <ErrorMessage text={msgError} isVisible={error} />
        <Form>
          <Item floatingLabel>
            <Label style={{ color: "#FFFFFF" }}>Nombre</Label>
            <Input onChange={(e) => setNombre(e.nativeEvent.text)} />
            <Icon
              type="MaterialCommunityIcons"
              name="account"
              style={{ fontSize: 20, color: "#FFFFFF" }}
            />
          </Item>
          <Item floatingLabel>
            <Label style={{ color: "#FFFFFF" }}>Apellidos</Label>
            <Input onChange={(e) => setApellidos(e.nativeEvent.text)} />
            <Icon
              type="MaterialCommunityIcons"
              name="account"
              style={{ fontSize: 20, color: "#FFFFFF" }}
            />
          </Item>
          <Item floatingLabel>
            <Label style={{ color: "#FFFFFF" }}>Teléfono celular</Label>
            <Input
              onChange={(e) => setTelefono(e.nativeEvent.text)}
              style={{ fontSize: 20, color: "#FFFFFF" }}
            />
            <Icon
              type="MaterialCommunityIcons"
              name="cellphone"
              style={{ fontSize: 20, color: "#FFFFFF" }}
            />
          </Item>
          <View style={styles.butt}>
            <AppButton action={handleRegister} title="Registrarse" />
          </View>
          <View style={styles.txt}>
            <Text style={styles.txt} onPress={Login}>
              Si tengo una cuenta, haz clic aquí
            </Text>
          </View>
        </Form>
        <Loading text="Creando cuenta" isVisible={isVisibleLoading} />
      </ImageBackground>
    </Content>
  );
}

const styles = StyleSheet.create({
  inputForm: {
    width: "100%",
    marginTop: 20,
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
    marginTop: 20,
    alignItems: "center",
  },
  icono: {
    width: 24,
    height: 24,
  },
  iconRight: {
    color: "#C1C1C1",
  },
  btnContainerStyle: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#00a680",
  },
  info4: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  txt: {
    marginTop: 20,
    color: "#FFFFFF",
    alignItems: "center",
    fontSize: 18,
  },
});
