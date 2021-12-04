import React, { useState } from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import LoginForm from "../Forms/LoginForm";

export default function App({ navigation }) {
  const { signIn } = React.useContext(AuthContext);
  return (
    <NativeBaseProvider>
      <LoginForm signIn={signIn} navigation={navigation} />
    </NativeBaseProvider>
  );
}
