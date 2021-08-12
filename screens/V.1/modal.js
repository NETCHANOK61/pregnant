import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import firebase from "firebase";
import Fire from "./Fire";
import "firebase/auth";

import { TouchableOpacity } from "react-native-gesture-handler";

export default class Modal extends React.Component {
  // รับค่า props
  // setState default
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      list: [],
      user: [],
    };
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  // ก่อน render
  componentWillUnmount() {
    // เตรียมค่าต่างๆ ก่อน render
    _isMounted = false;
    this.unsubscribe();
  }

  // render นำ element ลง DOM
  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <FlatList
          style={styles.feed}
          showsVerticalScrollIndicator={false}
          data={this.state.list}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => this.renderPost(item)}
        />
      </View>
    );
  }

  // render ในแต่ละ flatlist
  renderPost = (post) => {
    const { modalVisible } = this.state;
    return (
      <View style={styles.feedItem}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                ต้องการลบโพสต์นี้ใช่หรือไม่
                หากลบแล้วระบบจะไม่สามารถกู้คืนข้อมูลได้
              </Text>

              <View style={{ flexDirection: "row" }}>
                <View>
                  <Pressable
                    style={[styles.button, styles.buttonNo]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>ยกเลิก</Text>
                  </Pressable>
                </View>
                <View>
                  <Pressable
                    style={[styles.button, styles.buttonYes]}
                    onPress={() => [
                      this.deleteHandle(post.key),
                      this.setModalVisible(!modalVisible),
                    ]}
                  >
                    <Text style={styles.textStyle}>ตกลง</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Image
          style={styles.avatar}
          source={
            this.state.user.avatar
              ? { uri: this.state.user.avatar }
              : require("../assets/war.jpg")
          }
        ></Image>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{this.state.user.name}</Text>
              {/* แสดงเวลาโพสต์ */}
              <Text style={styles.timestamp}>
                {new Date(post.timestamp).toUTCString()}
              </Text>
            </View>
          </View>
          <Text style={styles.post}>{post.text}</Text>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
          {/* <TouchableOpacity onPress={() => this.deleteHandle(post.key)}>
            <Ionicons name="trash" size={24} color="tomato"></Ionicons>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => this.setModalVisible(!modalVisible)}>
            <Ionicons name="trash" size={24} color="tomato"></Ionicons>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // กดลบ
  deleteHandle = (id) => {
    Fire.shared.deletePost(id);
  };

  // หลังจาก render เสร็จ
  _onRefresh() {
    this.setState({ refreshing: true });
    fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }
  componentDidMount() {
    _isMounted = true;
    const user = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        this.setState({ user: doc.data() });
      });
    const ref = firebase.firestore().collection("posts");
    ref
      .where("uid", "==", user)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        var li = [];
        snapshot.forEach((doc) => {
          li.push({
            key: doc.id,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            image: doc.data().image,
          });
        });
        this.setState({ list: li });
      });
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFECF4",
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: windowHeight * 0.05,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: windowWidth * 0.8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: windowWidth * 0.05,
  },
  buttonYes: {
    backgroundColor: "#FF1E1E",
  },
  buttonNo: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
