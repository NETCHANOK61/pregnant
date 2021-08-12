import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Fire from "./Fire";
import "firebase/auth";
import UserPermission from "../utilities/UserPermission";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import { ActionSheet } from "react-native-cross-actionsheet";

// const firebase = require("firebase");
// require("firebase/firestore");
export default class PostScreenV1 extends React.Component {
  // รับค่า props
  // setState default
  state = {
    text: "",
    image: null,
    user: {},
  };
  // ก่อน render
  componentWillUnmount() {
    // เตรียมค่าต่างๆ ก่อน render
    this.unsubscribe();
    _isMounted = false;
  }
  // render นำ element ลง DOM
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* ครอบ scrollView เพื่อให้สามารถซ่อนคีย์บอร์ดได้ */}
        <ScrollView>
          <StatusBar style="dark" />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#D8D9DB"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handlePost}>
              <Text style={{ fontWeight: "500" }}>Post</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Image
              style={styles.avatar}
              source={
                this.state.user.avatar
                  ? { uri: this.state.user.avatar }
                  : require("../assets/war.jpg")
              }
            ></Image>
            {/* ข้อความบรรยาย */}
            <TextInput
              autoFocus={false}
              multiline={true}
              numberOfLines={4}
              style={{ flex: 1 }}
              placeholder="Tell me somthing"
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            ></TextInput>
          </View>
          <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
            <Ionicons name="image" size={32} color="#D8D9DB" />
            <Text>เลือกจากอัลบัม</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photo} onPress={this.takePhoto}>
            <Ionicons name="md-camera" size={32} color="#D8D9DB" />
            <Text>ถ่ายภาพ</Text>
          </TouchableOpacity>
          <View style={{ marginHorizontal: 32, marginTop: 32, height: 250 }}>
            {this.state.image != null ? (
              <Image
                source={{ uri: this.state.image }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // หลังจาก render เสร็จ
  componentDidMount() {
    // this._isMounted = true;
    UserPermission.getAllCameraPermission();
    _isMounted = true;
    const user = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        this.setState({ user: doc.data() });
      });
  }

  handlePost = () => {
    Fire.shared
      .addPost({ text: this.state.text.trim(), localUri: this.state.image })
      .then((ref) => {
        this.setState({ text: "", image: null });
        this.props.navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };
  
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    } else {
      this.setState({ image: null });
    }
  };

  takePhoto = async () => {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!data.cancelled) {
      this.setState({ image: data.uri });
    } else {
      this.setState({ image: null });
    }
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
  containerLoad: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
