import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import EstadoForm from "../Forms/EstadoForm";

export default function Confirmar({ navigation, route }) {
  const { signOut } = React.useContext(AuthContext);

  //console.log(route);
  const pedidoGet = route.params.pedido;
  return (
    <NativeBaseProvider>
      <EstadoForm
        signOut={signOut}
        navigation={navigation}
        pedido={pedidoGet}
      />
    </NativeBaseProvider>
  );
}
