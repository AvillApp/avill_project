import React from "react";
import { Container } from "native-base";
import RegisterForm from "../../Forms/RegisterForm";

export default function Register({ navigation }) {
  return (
    <Container style={{ flex: 1 }}>
      <RegisterForm navigation={navigation} />
    </Container>
  );
}
