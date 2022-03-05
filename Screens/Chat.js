import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import ChatForm from "../Forms/ChatForm";

export default function Chat({ navigation, route }) {
  const { signOut } = React.useContext(AuthContext);

  const pedidoGet = route.params.pedido;
  const accountGet = route.params.account;
  const pushTokenGet = route.params.pushToken;

  return (
    <NativeBaseProvider>
      <ChatForm 
        signOut={signOut}
        navigation={navigation}
        pedido={pedidoGet} 
        account={accountGet} 
        pushToken={pushTokenGet}
      />
    </NativeBaseProvider>
  );
}