import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import ViajesForm from "../Forms/ViajesForm";

export default function Viajes({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <NativeBaseProvider>
      <ViajesForm signOut={signOut} navigation={navigation} />
    </NativeBaseProvider>
  );
}
