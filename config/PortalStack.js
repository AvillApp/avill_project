import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Portal from "../Screens/Portal";
import Confirmar from "../Screens/Confirmar";
import Estado from "../Screens/Estado";
import Viajes from "../Screens/Viajes";

const PortalStack = createStackNavigator(); // Panel de realizar los pedidos y ver el estado
const ViajesStack = createStackNavigator(); // Panel de realizar los pedidos y ver el estado

const PortalStackScreen = () => (
  <PortalStack.Navigator>
    <PortalStack.Screen
      name="Inicio"
      options={{
        headerTitle: "Portal",
        headerShown: false,
      }}
      component={Portal}
    />
    <PortalStack.Screen
      name="Confirmar"
      options={{
        headerTitle: "Confirmar",
        headerShown: true,
      }}
      component={Confirmar}
    />
    <PortalStack.Screen
      name="Estado"
      options={{
        headerTitle: "Seguimiento de viaje",
        headerShown: false,
      }}
      component={Estado}
    />
  </PortalStack.Navigator>
);

const ViajesStackScreen = () => (
  <ViajesStack.Navigator>
    <ViajesStack.Screen
      name="Viajes"
      options={{
        headerTitle: "Mis viajes",
        headerShown: true,
      }}
      component={Viajes}
    />
    <ViajesStack.Screen
      name="Estado"
      options={{
        headerTitle: "Seguimiento de viaje",
        headerShown: false,
      }}
      component={Estado}
    />
  </ViajesStack.Navigator>
);

const Tabs = createBottomTabNavigator();

const TabsScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen
      name="Portal"
      options={{
        headerTitle: "Contacts",
        headerShown: false,
      }}
      component={PortalStackScreen}
    />
    <Tabs.Screen
      name="Mis Viajes"
      options={{
        headerTitle: "Mis Viajes",
        headerShown: false,
      }}
      component={ViajesStackScreen}
    />
  </Tabs.Navigator>
);

const AppDrawer = createDrawerNavigator();
export default AppDrawerScreen = () => (
  <AppDrawer.Navigator>
    <AppDrawer.Screen
      name="Tabs"
      component={TabsScreen}
      options={() => {
        return {
          drawerLabel: "Portal",
          headerTitle: "",
        };
      }}
    />
    {/* <AppDrawer.Screen
      name="Settings"
      component={Settings}
      options={{
        gestureEnabled: false,
      }}
    /> */}
  </AppDrawer.Navigator>
);
