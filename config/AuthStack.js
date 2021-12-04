import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";

const AuthStack = createStackNavigator();
export default AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={() => {
        return {
          headerShown: false,
        };
      }}
    />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);
