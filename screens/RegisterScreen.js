import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Fire from "./Fire";
import { Dimensions } from "react-native";
import UserPermission from "../utilities/UserPermission";
import * as ImagePicker from "expo-image-picker";

export default class RegisterScreen extends React.Component {
  // กำหนดให้ไม่มี header
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    user: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
    errorMessage: null,
  };
  handlePickAvatar = async () => {
    UserPermission.getCameraPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ user: { ...this.state.user, avatar: result.uri } });
    }
  };
  handleSignUp = () => {
    Fire.shared.createUser(this.state.user);
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TouchableOpacity
          style={styles.btn_back}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons name="arrow-back" color="#000" size={32}></Ionicons>
        </TouchableOpacity>
        <Text style={styles.greeting}>{`Hello!\nSign Up to started.`}</Text>
        <TouchableOpacity
          style={styles.avatarPlaceholder}
          onPress={this.handlePickAvatar}
        >
          <Image
            source={{ uri: this.state.user.avatar }}
            style={styles.avatar}
          ></Image>
          <Ionicons
            name="add"
            size={50}
            color="#fff"
            style={{ marginTop: 6, marginLeft: 2 }}
          ></Ionicons>
        </TouchableOpacity>
        <View style={styles.form}>
          <View style={{ marginTop: 8 }}>
            <Text style={styles.inputTitle}>Full Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(name) =>
                this.setState({ user: { ...this.state.user, name } })
              }
              value={this.state.user.name}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(email) =>
                this.setState({ user: { ...this.state.user, email } })
              }
              value={this.state.user.email}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(password) =>
                this.setState({ user: { ...this.state.user, password } })
              }
              value={this.state.user.password}
            />
          </View>
        </View>
        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{ color: "#fff", fontWeight: "500" }}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            Have Account?
            <Text style={{ fontWeight: "500", color: "#E9446A" }}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  btn_back: {
    position: "absolute",
    top: 48,
    left: 12,
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "rgba(21, 22, 48, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  greeting: {
    marginTop: 0.05 * windowHeight,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
  avatar: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E2E6",
    marginTop: 48,
    marginLeft: windowWidth / 2.8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 5,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
