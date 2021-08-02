import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { FirebaseKeys } from "../Config";
import UserPermission from "../utilities/UserPermission";

export default function App({ navigation }) {
  if (!Firebase.apps.length) {
    Firebase.initializeApp(FirebaseKeys);
  }
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagelink, setImagelink] = useState();
  const [textDiary, setTextDiary] = useState();
  const [check, setCheck] = useState(false);
  const [userName, setUserName] = useState();
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setCheck(true);
    }
  };
  const uploadImgae = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const ref = Firebase.storage().ref().child(new Date().toISOString());
    const snapshot = ref.put(blob);

    snapshot.on(
      Firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        setUploading(true);
      },
      (error) => {
        setUploading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          setImagelink(url);
          console.log("download url: ", imagelink);
          blob.close();
          Alert.alert(
            "Image Uploaded!",
            "Your image has been Uploaded to Firebase Cloud Storage Successfully!"
          );
          return url;
        });
      }
    );
    const { email, displayName } = Firebase.auth().currentUser;
    setUserName(displayName);
    console.log(userName);
  };
  const addPostHandler = (obj) => {
    const ref = Firebase.firestore().collection("posts");
    ref
      .add(obj)
      .then(() => {
        console.log("add successfully");
      })
      .catch((err) => console.log(err));
  };
  const submitPost = (e) => {
    e.preventDefault();
    const obj = {
      owner : userName,
      img: imagelink,
      text: textDiary,
    };
    setImage("../assets/icon.png");
    setImagelink();
    setTextDiary("");
    addPostHandler(obj);
    setCheck(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* ครอบ scrollView เพื่อให้สามารถซ่อนคีย์บอร์ดได้ */}
      <ScrollView>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={24} color="#D8D9DB"></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={submitPost}>
            <Text style={{ fontWeight: "500" }}>Post</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Image source={require("../assets/war.jpg")} style={styles.avatar} />
          <TextInput
            autoFocus={false}
            multiline={true}
            numberOfLines={4}
            style={{ flex: 1 }}
            placeholder="Tell me somthing"
            onChangeText={(text) => setTextDiary(text)}
            value={textDiary}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.photo} onPress={pickImage}>
          <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 32, marginTop: 32, height: 250 }}>
          {check && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          <TouchableOpacity style={styles.photo} onPress={uploadImgae}>
            <Text>Uploaded</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
});
