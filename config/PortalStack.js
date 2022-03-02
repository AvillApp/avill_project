import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Portal from "../Screens/Portal";
import Confirmar from "../Screens/Confirmar";
import Estado from "../Screens/Estado";
import Chat from "../Screens/Chat";
import Viajes from "../Screens/Viajes";
import Perfil from "../Screens/Perfil";

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
     <PortalStack.Screen
      name="Chat"
      options={{
        headerTitle: "Chat de viaje",
        headerShown: true,
      }}
      component={Chat}
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
  <Tabs.Navigator
  screenOptions={{
    tabBarActiveTintColor: 'yellow',
    tabBarInactiveTintColor: 'white',
    backgroundColor: '#c6cbef',

    tabBarStyle: {
      backgroundColor: 'green',
    },
  }}
  >
    <Tabs.Screen
      name="Portal"
      options={{
        headerTitle: "Contacts",
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}
      component={PortalStackScreen}
    />
    <Tabs.Screen
      name="Mis Viajes"
      options={{
        headerTitle: "Mis Viajes",
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="car" color={color} size={26} />
        ),
      }}
      component={ViajesStackScreen}
    />
  </Tabs.Navigator>
);

const AppDrawer = createDrawerNavigator();


function CustomDrawerContent({ progress, ...rest }) {
  // const translateX = Animated.interpolate(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [-100, 0],
  // });

  

  return (
    <DrawerContentScrollView {...rest}>
      <Animated.View>
        <DrawerItemList {...rest} />
          {/* <DrawerItem label="Términos y condiciones" onPress={() => alert('Link to help')} />
          <DrawerItem label="Salir" onPress={() => CerraCuenta()} /> */}

      </Animated.View>
    </DrawerContentScrollView>
  );
}

export default AppDrawerScreen = () => (
  <AppDrawer.Navigator
  
  drawerContent={(props) => <CustomDrawerContent {...props} />}
  // screenOptions={{
  //   drawerStyle: {
  //     backgroundColor: '#c6cbef',
  //     width: 240,
  //   },
  // }}
  
  >
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
    {<AppDrawer.Screen
      name="Perfil"
      component={Perfil}
      options={{
        drawerLabel: "Perfil",
        gestureEnabled: false,
      }} 
    />}
  </AppDrawer.Navigator>
);
