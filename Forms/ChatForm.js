import React, { useState, useEffect } from "react";
import {
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
  Input,
  Button
} from "native-base";
import { Badge } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import API from "../Lib/Db";

export default function ChatForm({ navigation, signIn, pedido, account }) {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState();

  const getIdpedido = async () => {
    const response = await API.get(`chat/order/?pedido=${pedido}&ordering=-id&format=json`);
    const resUser = response.data;
    setData(resUser); // Logs
  };


  useEffect(() => {
   
      const interval = setInterval(() => {
        getIdpedido();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
  }, []);

  const HandleSeguimiento = async () => {
    console.log("Hizo clic");

    const payload = {
        msg: msg,
        pedido: pedido,
        account: account
    }

    await API.post(`chat/order/`, payload);
    setMsg('')
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
                    <Text>{item.account}: {item.msg}</Text>
                  </VStack>
                  
                </HStack>
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />
        </VStack>
        <Input
            style={{ fontSize: 20, color: "black" }}
            placeholder="Introduzca su mensaje"
            mt="15"
            mb="2"
            variant="underlined"
            value={msg}
            onChange={(e) => setMsg(e.nativeEvent.text)}
          />
         <Button
            mb="2"
            colorScheme="yellow"
            key="lg"
            size="lg"
            variant="solid"
            onPress={() => HandleSeguimiento()}
          >
            Enviar
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
