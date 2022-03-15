import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { KeyboardAvoidingView, VStack } from "native-base";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppButton from "./AppButton";
import API from "./Db";

export default function Loading(props) {
  const {
    isVisible,
    text,
    pedido,
    NotifiyPush,
    tokenPush,
    conductor,
    photo,
    vehiculo,
  } = props;
  const [confir, setConfir] = useState(true);

  const ChangedEstado = async (est) => {
    const pedido_change = {
      estado: est,
    };
    await API.put(`orders/${pedido}/`, pedido_change);
  };

  const CancelarViaje = async () => {
    const id_user = await AsyncStorage.getItem("id_user");
    setConfir(false);
    // Enviamos primera información
    const titulo = "Cancelación de servicio";
    const descripcion = "Haz cancelado el servicio";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };

    const payload = {
      // Desbloqueamos el vehículo
      estado: true,
    };

    await API.put(`cars/${vehiculo}/`, payload);
    const response3 = await API.post(`activiorders/`, logs_pedido);

    NotifiyPush(tokenPush, "El cliente ha cancelado el viaje!");
    ChangedEstado(8); // Cancelar pedido
  };

  const ConfirmarViaje = async () => {
    // const id_pedido = await AsyncStorage.getItem("id_pedido");
    setConfir(false);
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
      // Bloqueamos el vehículo
      estado: false,
    };
    await API.put(`cars/${vehiculo}/`, payload);
    await API.post(`activiorders/`, logs_pedido);

    NotifiyPush(tokenPush, "El cliente ha confirmado tu viaje!");
    ChangedEstado(4); // Confirmar pedido
  };

  const acciones = () => {
    return (
      <>
        <AppButton title="CONFIRMAR" action={ConfirmarViaje} />
        <Text>{"\n"}</Text>
        <AppButton title="CANCELAR" action={CancelarViaje} />
      </>
    );
  };
  return (
    <KeyboardAvoidingView
      h={{
        base: "420px",
        lg: "auto",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <VStack p="6" flex="1">
        {text && <Text style={styles.text}>{text}</Text>}
        <Avatar.Image
          size={55}
          source={{
            uri: photo,
          }}
        />
        <Text>{"\n"}</Text>
        {confir && acciones()}

        {!confir && <Text>Espere por favor ...</Text>}
      </VStack>
    </KeyboardAvoidingView>
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
