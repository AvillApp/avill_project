import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import PerfilForm from "../Forms/PerfilForm";

export default function Perfil({ navigation, route }) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <NativeBaseProvider>
      <PerfilForm 
        signOut={signOut}
        navigation={navigation}
      />
    </NativeBaseProvider>
  );
}