import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  KeyboardAvoidingView,
  VStack,
  Text,
  FlatList,
  Box,
  HStack,
  Spacer,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Badge } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import API from "../Lib/Db";

export default function ViajesForm({ navigation, signIn }) {
  const [data, setData] = useState([]);
  const [retri, setRetri] = useState(true);

  const getIdpedido = async () => {
    const id_user = await AsyncStorage.getItem("id_user");
    const response = await API.get(`orders/?account=${id_user}&format=json`);
    const resUser = response.data;
    setData(resUser); // Logs
  };

  useEffect(() => {
    if (retri) {
      getIdpedido();
      setRetri(false);
    }
  }, []);

  const HandleSeguimiento = (id) => {
    console.log("Hizo clic");
    // navigation.navigate("Estado", {
    //   pedido: id,
    // });
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
        <VStack p="2" flex="1">
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Box
                borderBottomWidth="1"
                _dark={{
                  borderColor: "gray.600",
                }}
                borderColor="coolGray.200"
                pl="4"
                pr="5"
                py="2"
              >
                <HStack
                  space={3}
                  justifyContent="space-between"
                  onPress={() => HandleSeguimiento(item.id)}
                >
                  <VStack>
                    <Text>Destino: {item.destino}</Text>
                    <Text>Costo: {item.precio}</Text>
                    <Text>Fecha: {item.modified}</Text>
                  </VStack>
                  <Spacer />
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    alignSelf="flex-start"
                  >
                    {item.estado == 7 && (
                      <Badge status="success" value="Finalizado" />
                    )}
                    {item.estado == 8 && (
                      <Badge status="error" value="Cancelado" />
                    )}
                    {(item.estado == 9 || item.estado == 3) && (
                      <Badge status="warning" value="En espera" />
                    )}
                    {item.estado == 6 && (
                      <Badge status="primary" value="En ruta" />
                    )}
                    {item.estado == 4 && (
                      <Badge status="primary" value="Confirmado" />
                    )}
                    {item.estado == 5 && (
                      <Badge status="primary" value="En camino" />
                    )}
                  </Text>
                </HStack>
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />
          {/* {data.map((datos) => (
            <ListItem
              key={datos.id}
              onPress={() => HandleSeguimiento(datos.id)}
            >
              <Body>
                <Text>Destino: {datos.destino}</Text>
                <Text>Costo: {datos.precio}</Text>
                <Text>Fecha: {datos.modified}</Text>
              </Body>
              <Right>
                <Right>
                  {datos.estado == 7 && (
                    <Badge status="success" value="Finalizado" />
                  )}
                  {datos.estado == 8 && (
                    <Badge status="error" value="Cancelado" />
                  )}
                  {(datos.estado == 9 || datos.estado == 3) && (
                    <Badge status="warning" value="En espera" />
                  )}
                  {datos.estado == 6 && (
                    <Badge status="primary" value="En ruta" />
                  )}
                  {datos.estado == 4 && (
                    <Badge status="primary" value="Confirmado" />
                  )}
                  {datos.estado == 5 && (
                    <Badge status="primary" value="En camino" />
                  )}
                </Right>
              </Right>
            </ListItem>
          ))} */}
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
