import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Overlay } from "react-native-elements";
import AppButton from "./AppButton";
import API from "./Db";

export default function Loading(props) {
  const { isVisible, text, pedido, NotifiyPush, tokenPush, conductor } = props;

  const ChangedEstado = async (est) => {
    const pedido_change = {
      estado: est,
    };
    const response = await API.put(`orders/${pedido}/`, pedido_change);
  };

  const CancelarViaje = async () => {
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Cancelación de servicio";
    const descripcion = "Haz cancelado el servicio";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };

    const response3 = await API.post(`activiorders/`, logs_pedido);
    NotifiyPush(tokenPush, "El cliente ha cancelado el viaje!");
    ChangedEstado(8); // Cancelar pedido
  };

  const ConfirmarViaje = async () => {
    // const id_pedido = await AsyncStorage.getItem("id_pedido");
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Confirmación del viaje servicio";
    const descripcion = "Haz confirmado el servicio";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };

    const payload = {
      estado: 2,
    };
    await API.post(`activiorders/`, logs_pedido);
    //if(tokenPush!=="")
    NotifiyPush(tokenPush, "El cliente ha confirmado tu viaje!");
    // Bloqueamos  conductor
    await API.put(`accounts/${conductor}/`, payload);
    ChangedEstado(4); // Confirmar pedido
  };
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0, .5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.view}>
        {text && <Text style={styles.text}>{text}</Text>}
        <Text>{"\n"}</Text>
        {/* {precio && <Text>Costo: ${precio}</Text>} */}
        <AppButton title="CONFIRMAR" action={ConfirmarViaje} />
        <Text>{"\n"}</Text>
        <AppButton title="CANCELAR" action={CancelarViaje} />
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 500,
    width: 600,
    backgroundColor: "#fff",
    borderColor: "#00a680",
    borderWidth: 2,
    borderRadius: 10,
  },
  form: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#00a680",
    textTransform: "uppercase",
    marginTop: 10,
  },
});
