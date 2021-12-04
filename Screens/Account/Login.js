import React from "react";
import { Container, NativeBaseProvider } from "native-base";
import LoginForm from "../../Forms/LoginForm";

export default function Login({ navigation }) {
  return (
    <NativeBaseProvider>
      {/* // <Container style={{ flex: 2 }}> */}
      <LoginForm navigation={navigation} />
    </NativeBaseProvider>
  );
}
