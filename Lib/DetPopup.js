import React from "react";
import { View, Text, Image } from "react-native";

export default function Loading(props) {
  return (
    <View>
      <Image source={ICONOS.LOADING} style={styles.logo} resizeMode="cover" />
      <Text></Text>
    </View>
  );
}
