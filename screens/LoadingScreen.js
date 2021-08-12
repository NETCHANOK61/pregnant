import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import "firebase/auth";

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        {/* รอโหลดหน้า หมุนๆ */}
        <ActivityIndicator size="large" color="#E9446A"></ActivityIndicator>
        <StatusBar style="auto" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
