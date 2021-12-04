import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Overlay } from "react-native-elements";
import { Form, Item, Input, Label, Select } from "native-base";
import AppButton from "./AppButton";
import API from "./Db";

export default function Loading(props) {
  const { isVisible, text, pedido } = props;
  const [precio, setPrecio] = useState();
  const [tiempo, setTiempo] = useState();
  const [vehiculoCondu, setVehiculoCondu] = useState([]);
  const [vehiculo, setVehiculo] = useState();

  const ChangedEstado = async (est, pre, time, vehi) => {
    const pedido_change = {
      estado: est,
      precio: pre,
      tiempo: time,
      vehiculo: vehi,
    };
    console.log(pedido_change);
    const response = await API.put(`ordersup/${pedido}/`, pedido_change);
    // console.log("resultado: ", response.data);
  };

  const CancelarViaje = async () => {
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Cancelación de servicio";
    const descripcion = "El conductor ha cancelado el servicio";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };
    if (vehiculo && tiempo && precio) {
      const response3 = await API.post(`activiorders/`, logs_pedido);
      ChangedEstado(8, precio, tiempo, vehiculo); // Cancelar pedido
    }
  };

  const ConfirmarViaje = async () => {
    // const id_pedido = await AsyncStorage.getItem("id_pedido");
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Vehiculo Confirmado";
    const descripcion = "Estamos en camino";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };
    if (vehiculo && tiempo && precio) {
      const response3 = await API.post(`activiorders/`, logs_pedido);
      ChangedEstado(9, precio, tiempo, vehiculo); // Por Confirmar pedido por parte del cliente
    }
  };

  useEffect(() => {
    const VehiculosCondu = async () => {
      const id_user = await AsyncStorage.getItem("id_user");

      const response5 = await API.get(`cars/?persona=${id_user}`);
      setVehiculoCondu(response5.data);
    };

    VehiculosCondu();
  }, []);

  const handleTipo = async (value) => {
    setVehiculo(value);
  };
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0, .5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.form}>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
        <Form>
          <Item>
            <Label>Precio: </Label>
            <Input
              style={{ fontSize: 20 }}
              onChange={(e) => setPrecio(e.nativeEvent.text)}
            />
          </Item>
          <Item>
            <Label>Tiempo: </Label>
            <Input onChange={(e) => setTiempo(e.nativeEvent.text)} />
          </Item>
          <Select
            minWidth="200"
            accessibilityLabel="SELECCIONE VEHICULO"
            placeholder="SELECCIONE VEHICULO"
            selectedValue={vehiculo}
            onValueChange={(itemValue, itemIndex) => handleTipo(itemValue)}
            variant="outline"
            style={{ fontSize: 20 }}
            placeholderTextColor="black"
            mt={1}
          >
            {vehiculoCondu.map((serv) => (
              <Select.Item
                key={serv.id}
                label={serv.placa + "" + serv.marca}
                value={serv.id}
              />
            ))}
          </Select>
        </Form>
      </View>
      <View style={styles.view}>
        <AppButton title="CONFIRMAR" action={() => ConfirmarViaje()} />
        <Text>{"\n"}</Text>
        <AppButton title="CANCELAR" action={() => CancelarViaje()} />
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
