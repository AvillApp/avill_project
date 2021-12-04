import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./AuthStack";
import AppDrawerScreen from "./PortalStack";

import { AuthContext } from "./Context";

// const getPushToken = () => {
//   if (!Constants.isDevice) {
//     return Promise.reject("Must use physical device for Push Notifications");
//   }

//   try {
//     return Notifications.getPermissionsAsync()
//       .then((statusResult) => {
//         return statusResult.status !== "granted"
//           ? Notifications.requestPermissionsAsync()
//           : statusResult;
//       })
//       .then((statusResult) => {
//         if (statusResult.status !== "granted") {
//           throw "Failed to get push token for push notification!";
//         }
//         return Notifications.getExpoPushTokenAsync();
//       })
//       .then((tokenData) => tokenData.data);
//   } catch (error) {
//     return Promise.reject("Couldn't check notifications permissions");
//   }
//};

export default () => {
  const [user, setUser] = React.useState(null);

  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   getPushToken().then((pushToken) => {
  //     setExpoPushToken(pushToken);
  //     console.log("PushToke: ", pushToken);
  //   });

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener(setNotification);

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       setNotification(response.notification);
  //     });

  //   return () => {
  //     notificationListener.current &&
  //       Notifications.removeNotificationSubscription(
  //         notificationListener.current
  //       );
  //     responseListener.current &&
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

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
