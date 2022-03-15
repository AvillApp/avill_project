import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Dimensions, View } from "react-native";
import {
  KeyboardAvoidingView,
  VStack,
  Text,
  Select,
  Button,
} from "native-base";
import { Avatar, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppButton from "../Lib/AppButton";
import API from "../Lib/Db";
import Popup from "../Lib/Popup";
import NotifiyPush from "../Lib/Notify";
import { AirbnbRating } from "react-native-ratings";
import StepIndicator from "react-native-step-indicator";

export default function PedidoForm({ navigation, pedido }) {
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [txt, setTxt] = useState();
  const [seguimiento, setSeguimiento] = useState(1); // Estado en espera
  const [searchInfo, setSearchInfo] = useState(true);
  const [searchSegui, setSearchSegui] = useState(true);
  const [seguiEstado, setSeguiEstado] = useState();
  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  const handlePress2 = () => setExpanded2(!expanded2);

  const [puntos, setPuntos] = useState(5);
  const [disableRatting, setDisableRatting] = useState(false);

  const [infoViaje, setInfoViaje] = useState({
    creado: "",
    direccion: "",
    observacion: "",
    telefono: "",
    precio: "",
    id: "",
  });
  const [conductor, setConductor] = useState({
    nombre: "",
    placa: "",
    photo: "",
    tiempo: "",
    tokenPush: "",
    id: "",
    vehiculo: "",
  });

  const Changed2Estado = async (est, vehiculo) => {
    setSeguiEstado(est);
    const pedido_change = {
      estado: est,
    };
    // console.log(pedido_change);
    //console.log("token del conductor2: ", conductor.tokenPush);
    await API.put(`ordersup/${pedido}/`, pedido_change);
    await API.put(`cars/${vehiculo}/`, {
      estado: true,
    });

    NotifiyPush(conductor.tokenPush, "El cliente ha confirmado tu viaje!");
    //console.log("resultado: ", response.data);
  };

  const infoPedido = async (id) => {
    const response = await API.get(`orders/${id}/?format=json`);
    return response.data;
  };

  const getInfo = async () => {
    //const pedido = await AsyncStorage.getItem("pedido");

    if (pedido) {
      const resUser = await infoPedido(pedido);

      if (infoViaje.creado === "") {
        setInfoViaje({
          creado: resUser.created,
          direccion: resUser.destino,
          observacion: resUser.indicacion,
          telefono: resUser.telealt,
          precio: resUser.precio,
          id: resUser.account,
        });
      }
      if (resUser.vehiculo !== null) {
        if (conductor.nombre === "") {
          setConductor({
            nombre:
              resUser.vehiculo.persona.name +
              " " +
              resUser.vehiculo.persona.last_name,
            placa: resUser.vehiculo.placa,
            photo: resUser.vehiculo.persona.photo.photo,
            tiempo: resUser.tiempo,
            tokenPush: resUser.vehiculo.persona.tokenPush,
            id: resUser.vehiculo.persona.id,
            vehiculo: resUser.vehiculo.id,
          });
          setSearchInfo(false);
        }
      }

      if (resUser.estado === 7 || resUser.estado === 8) {
        // Finalizado o cancelado
        // Viaje finalizaado
        setSearchSegui(false);
        setSeguimiento(5);
        setIsVisibleLoading(false);
        await AsyncStorage.removeItem("pedido");

        const data = await API.get(
          `ratting/order/?pedido=${pedido}&format=json`
        );
        //console.log("Info: de califiación pedido: ", data.data);
        if (data.data.length > 0) {
          if (data.data[0].puntos > 0) {
            setPuntos(data.data.puntos);
            setDisableRatting(true);
          }
        }
      }

      if (resUser.estado === 8) {
        // Cancelado
        // Viaje finalizaado
        setSearchSegui(false);
        setSeguimiento(5);
        setIsVisibleLoading(false);
        await AsyncStorage.removeItem("pedido");
      }

      if (resUser.estado === 6)
        // En viaje
        setSeguimiento(4);
      if (resUser.estado === 5)
        // En camino
        setSeguimiento(3);

      if (resUser.estado === 4) {
        // Confirmado
        setSeguimiento(2);
        setSearchSegui(true); // Sincronice estado
        setIsVisibleLoading(false);
      }
      if (resUser.estado === 3)
        // En espera
        setSeguimiento(1);

      if (resUser.estado === 9) {
        // Por confirmar por parte del cliente (Conductor disponible)
        setIsVisibleLoading(true);
        setTxt(
          "¿Aceptar pedido? \n \n Valor:" +
            resUser.precio +
            "\n Tiempo: " +
            resUser.tiempo+
            "\n Placa: " +
            conductor.placa
            
            
        );
        setSearchSegui(false); // No sincronice por el momento.
      }
    }
  };

  useEffect(() => {
    if (seguimiento <= 4) {
      const interval = setInterval(() => {
        getInfo();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  const labels = [
    "Solicitado",
    "Confirmado",
    "En camino",
    "Viajando",
    "Finalizado",
  ];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#fe7013",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "#fe7013",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#fe7013",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#fe7013",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "#fe7013",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#fe7013",
  };

  const ValuePuntos = (ratting) => {
    setPuntos(ratting);
  };

  const Calificar = async () => {
    if (conductor.id) {
      const payloadAccount = {
        puntos: puntos,
        account: conductor.id,
        realizado_by: infoViaje.id,
      };
      await API.post(`ratting/account/`, payloadAccount);
    }

    const payloadPedido = {
      puntos: puntos,
      pedido: pedido,
      realizado_by: infoViaje.id,
    };

    // Registramos calificació del pedido
    await API.post(`ratting/order/`, payloadPedido);
    setDisableRatting(true);

    if (conductor.tokenPush !== "")
      NotifiyPush(conductor.tokenPush, "El cliente ha calificado tu viaje!");

    navigation.goBack("Inicio");
  };

  const Chatear = () => {
    navigation.navigate("Chat", {
      pedido: pedido,
      account: infoViaje.id,
      pushToken: conductor.tokenPush,
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        h={{
          base: "600px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        styles={styles.fondo}
      >
        <VStack p="3" flex="1">
        {isVisibleLoading && (
          <Popup
            text={txt}
            isVisible={isVisibleLoading}
            pedido={pedido}
            tokenPush={conductor.tokenPush}
            conductor={conductor.id}
            photo={conductor.photo}
            NotifiyPush={NotifiyPush}
            vehiculo={conductor.vehiculo}

          />
        )}
          <List.Section>
            <List.Accordion
              title="Info. del viaje"
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={handlePress}
            >
              <Text>Creado el: {infoViaje.creado}</Text>
              <Text>Dirección: {infoViaje.direccion}</Text>
              <Text>Observación: {infoViaje.observacion}</Text>
              <Text>Telefono alternativo: {infoViaje.telefono}</Text>
            </List.Accordion>
            {conductor.nombre !== "" && (
              <List.Accordion
                title="Conductor"
                left={(props) => <List.Icon {...props} icon="folder" />}
              >
                <View>
                  <Avatar.Image
                    size={55}
                    source={{
                      uri: conductor.photo,
                    }}
                  />
                  <Text>Placa: {conductor.placa}</Text>
                  <Text>Nombre: {conductor.nombre}</Text>
                  <Text>Tiempo de espera: {conductor.tiempo}</Text>
                </View>
              </List.Accordion>
            )}
            <List.Accordion
              title="Seguimiento"
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded2}
              onPress={handlePress2}
            >
              <StepIndicator
                customStyles={customStyles}
                currentPosition={seguimiento}
                labels={labels}
              />
            </List.Accordion>

            {seguimiento >= 2 && seguimiento <= 4 && (
              <View>
                <Text>{"\n"}</Text>
                <Select
                  minWidth="200"
                  accessibilityLabel="¿MUY DEMORADO?"
                  placeholder="¿MUY DEMORADO?"
                  selectedValue={seguiEstado}
                  onValueChange={(itemValue, itemIndex) =>
                    Changed2Estado(itemValue, conductor.vehiculo)
                  }
                  variant="outline"
                  placeholderTextColor="black"
                  mt={1}
                  style={{ fontSize: 20 }}
                >
                  <Select.Item key="8" label="Cancelar" value="8" />
                </Select>
                <Button
                  colorScheme="yellow"
                  key="lg"
                  size="lg"
                  variant="solid"
                  onPress={() => Chatear()}
                >
                  Chat
                </Button>
              </View>
            )}
            {seguimiento === 5 && (
              <View style={styles.butt}>
                <AirbnbRating
                  count={5}
                  reviews={["Muy Mal", "Mal", "Regular", "Bien", "Excelente"]}
                  defaultRating={puntos}
                  size={20}
                  isDisabled={disableRatting}
                  onFinishRating={ValuePuntos}
                />
                <Text>{"\n"}</Text>
                {disableRatting === false && (
                  <AppButton action={Calificar} title="Calificar Servicio" />
                )}
              </View>
            )}
          </List.Section>
        </VStack>
      </KeyboardAvoidingView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  logo: {
    height: 64,
    width: 64,
  },
  conductor: {
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },
  butt: {
    marginTop: 30,
    alignItems: "center",
    color: "#FFFFFF",
    fontSize: 15,
  },
});
