import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as firebase from "firebase";

export default class NotificationScreen extends React.Component { 
  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text>NotificationScreen!</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
