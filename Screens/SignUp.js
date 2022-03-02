import React, { useState } from "react";
import { NativeBaseProvider } from "native-base";
import { AuthContext } from "../config/Context";
import RegisterForm from "../Forms/RegisterForm";

export default function App({ navigation }) {
  const { signUp } = React.useContext(AuthContext);
  return (
    <NativeBaseProvider>
        <RegisterForm signIn={signUp} navigation={navigation} />
    </NativeBaseProvider>
  );
}

