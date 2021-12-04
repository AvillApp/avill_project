import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import PortalForm from "../Forms/PortalForm";

export default function Portal({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <NativeBaseProvider>
      <PortalForm signOut={signOut} navigation={navigation} />
    </NativeBaseProvider>
  );
}
