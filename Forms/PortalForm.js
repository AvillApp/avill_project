// import * as Location from "expo-location";
// import * as Network from "expo-network";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Dimensions } from "react-native";
import {
  Input,
  KeyboardAvoidingView,
  VStack,
  Text,
  Button,
  TextArea,
  Select,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../Lib/Loading";
import API from "../Lib/Db";
import NotifiyPush from "../Lib/Notify";
import Alerta from "../Lib/Alerta";

export default function PortalForm({ navigation, signIn }) {
  const [searcLoc, setSarchLoc] = useState(false);
  const [Emision, setEmision] = useState();
  const [Direccion, setDireccion] = useState();

  const [indicacion, setIndicacion] = useState("");
  const [tiposervicio, setTipoServicio] = useState();
  const [listTipoServ, setListTipoServ] = useState([]);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [servicio, setServicio] = useState();
  const [listServicio, setListservicio] = useState([]);
  const [alert, setAlert] = useState(false);
  const [texto, setTexto] = useState({
    title: "",
    status: "",
    txt: "",
  });

  // const NuevoPedido = () => {
  //   const dir = Direccion;
  //   const emi = Emision;
  //   setDireccion("");
  //   setEmision("");

  //   navigation.navigate("Confirmar", {
  //     emision: emi,
  //     direccion: dir,
  //   });
  // };

  const getSearch = async () => {
    const id_pedido = await AsyncStorage.getItem("pedido");

    setSarchLoc(true);

    if (id_pedido) {
      navigation.navigate("Estado", {
        pedido: id_pedido,
      });
    }
  };

  useEffect(() => {
    if (!searcLoc) getSearch();
  }, [searcLoc]);

  const [ubicacion, setUbicacion] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetch = async () => {
      //const response = await API.get(`typeservices?format=json`);
      const response = await API.get(`servicios?format=json`);

      setListTipoServ(response.data);

      //let location = await Location.getCurrentPositionAsync({});

      // setUbicacion({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      // });

      setUbicacion({
        latitude: parseFloat(0),
        longitude: parseFloat(-0),
      });
    };
    fetch();
  }, []);

  const handleTipo = async (value) => {
    setServicio(value);

    // const fetch = async () => {
    //   const response = await API.get(
    //     `services/?type_servicios=${value}&format=json`
    //   );
    //   setListservicio(response.data);
    // };
    // fetch();
  };

  const Pedido = async () => {
    setAlert(false);
    //const conexion = await Network.getNetworkStateAsync();
    //console.log(conexion);

    // if (!conexion.isInternetReachable) {
    //   setTexto({
    //     title: "Ops!",
    //     status: "warning",
    //     txt: "Ops,Al parecer tienes dificultades con tu conexión, verifica e intenta de nuevo",
    //   });
    //   setAlert(true);
    //   return false;
    // }

    if (Direccion && indicacion) {
      // Buscamos los vehículos que estén disponibles con ese servicio.

      const valueServ = servicio.split(",");
      console.log(valueServ[0]);

      const response4 = await API.get(
        `cars/?servicio=${valueServ[0]}&estado=1&format=json`
      );

      if (response4.data.length) {
        setIsVisibleLoading(true);
        const id_user = await AsyncStorage.getItem("id_user");

        // if(!ubicacion.longitude){

        // }
        const pedido = {
          emision: Emision,
          destino: Direccion,
          indicacion: indicacion,
          longitude: ubicacion.longitude,
          latitude: ubicacion.latitude,
          estado: 3,
          account: parseInt(id_user),
          solicitud: valueServ[1],
        };

        console.log(pedido);
        // //Enviamos orden.
        const response2 = await API.post(`orders/`, pedido);

        await AsyncStorage.setItem("pedido", response2.data.id.toString());

        if (ubicacion.longitude && ubicacion.latitude) {
          const payload = {
            longitude: ubicacion.longitude,
            latitude: ubicacion.latitude,
          };

          await API.put(`accounts/${parseInt(id_user)}/`, payload);
        }

        // Enviamos primera información
        const titulo = "Solicitud de servicio seguro ";
        const descripcion = "Haz solicitado un(a) " + servicio;

        const logs_pedido = {
          title: titulo,
          description: descripcion,
          pedido: parseInt(response2.data.id),
          realizado_by: parseInt(id_user),
        };

        await API.post(`activiorders/`, logs_pedido);

        response4.data.map((dt) => {
          //console.log("estado: ", dt.persona.tokenPush);
          if (dt.persona.tokenPush !== null) {
            NotifiyPush(
              dt.persona.tokenPush,
              "Hay un nuevo servicio en espera"
            );
          }
        });

        setIsVisibleLoading(false);
        navigation.navigate("Estado", {
          pedido: response2.data.id,
        });
      } else {
        setTexto({
          title: "Ops!",
          status: "warning",
          txt: "Lo siento, ningún vehículo disponible, intente buscar otro vehiculo",
        });
        setAlert(true);
      }
    } else {
      setTexto({
        title: "Ops!",
        status: "error",
        txt: "Ops, por favor introduce los datos y  selecciona el vehículo que quieres solicitar",
      });
      setAlert(true);
    }
  };

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
            placeholder="¿Dónde estas? (*)"
            mt="15"
            mb="2"
            value={Emision}
            onChange={(e) => setEmision(e.nativeEvent.text)}
          />
          <Input
            style={{ fontSize: 20, color: "black" }}
            placeholder="¿Hacia dónde vamos? (*)"
            mt="15"
            mb="5"
            value={Direccion}
            onChange={(e) => setDireccion(e.nativeEvent.text)}
          />
          <TextArea
            h={70}
            placeholder="¿Cómo  podemos llegar? (*)"
            value={indicacion}
            onChange={(e) => setIndicacion(e.nativeEvent.text)}
            w={{
              base: "100%",
            }}
            style={{ fontSize: 20 }}
          />
          <Select
            minWidth="200"
            accessibilityLabel="SERVICIO A SOLICITAR"
            placeholder="SERVICIO A SOLICITAR"
            selectedValue={servicio}
            onValueChange={(itemValue, itemIndex, itemLabel) => {
              setServicio(itemValue);
              setAlert(false);
            }}
            variant="outline"
            style={{ fontSize: 20 }}
            placeholderTextColor="black"
            mt={1}
          >
            {listTipoServ.map((serv) => (
              <Select.Item
                label={`${serv.type_servicios.nombre} - ${serv.nombre}`}
                value={`${serv.id},${serv.nombre}`}
                key={serv.id}
              />
            ))}
          </Select>
          {/* {tiposervicio >= 1 && (
            <Select
              minWidth="200"
              accessibilityLabel="SELECCIONE VEHICULO"
              placeholder="SELECCIONE VEHICULO"
              selectedValue={servicio}
              onValueChange={(itemValue, itemIndex, itemLabel) => {
                setServicio(itemValue);
                setAlert(false);
              }}
              variant="outline"
              placeholderTextColor="black"
              mt={1}
              style={{ fontSize: 20 }}
            >
              {listServicio.map((datos2) => (
                <Select.Item
                  key={datos2.id}
                  label={datos2.nombre}
                  value={`${datos2.id},${datos2.nombre}`}
                />
              ))}
            </Select>
          )} */}
          <Text>{"\n"}</Text>

          <Button
            colorScheme="yellow"
            key="lg"
            size="lg"
            variant="solid"
            onPress={() => Pedido()}
          >
            SOLICITAR
          </Button>
          <Loading
            text="Buscando Servicio Seguro"
            isVisible={isVisibleLoading}
          />
          <Text>{"\n"}</Text>
          {alert && (
            <Alerta
              title={texto.title}
              texto={texto.txt}
              status={texto.status}
            />
          )}

          {/* <Button
            colorScheme="yellow"
            key="lg"
            size="lg"
            variant="solid"
            onPress={() => NuevoPedido()}
          >
            IR
          </Button> */}
          {/* <View>
              <Image source={MARCA.FONDO_MAPA2} style={styles.logo} />
          </View> */}
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
