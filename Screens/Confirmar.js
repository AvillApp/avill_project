import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import ConfirmarForm from "../Forms/ConfirmarForm";

export default function Confirmar({ navigation, route }) {
  const { signOut } = React.useContext(AuthContext);

  //console.log(route);
  const direccionGet = route.params.direccion;
  const emisionGet = route.params.emision;
  return (
    <NativeBaseProvider>
      <ConfirmarForm
        signOut={signOut}
        navigation={navigation}
        emision={emisionGet}
        direccion={direccionGet}
      />
    </NativeBaseProvider>
  );
}
