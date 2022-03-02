import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./AuthStack";
import AppDrawerScreen from "./PortalStack";

import { AuthContext } from "./Context";

export default () => {
  const [user, setUser] = React.useState(null);
  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setUser("asd");
      },
      signUp: () => {
        setUser("asd");
      },
      signOut: () => {
        setUser(null);
      },
    };
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {user ? <AppDrawerScreen /> : <AuthStackScreen />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
