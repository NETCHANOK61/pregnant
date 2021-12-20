import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as firebase from "firebase";

export default class CountKickScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 60,
      count: 0,
      startVisible: true,
      restartVisible: false,
      kickVisible: false,
      saveVisible: false,
    };
  }
  componentDidMount() {
    // this.startTimer(); เปิดหน้าแล้วเริ่มนับถอยหลังเลย
  }
  // เริ่มนับถอยหลัง
  startTimer = () => {
    this.setState({
      startVisible: false,
      restartVisible: true,
      kickVisible: true,
    });
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  };
  tick = () => {
    let time = this.state.time;
    time -= 1;
    this.setState({ time });
    if (time <= 0) {
      clearInterval(this.timer);
      this.setState({
        restartVisible: true,
        kickVisible: false,
        saveVisible: true,
      });
    }
  };
  // รีเซ็ทตัวนับถอยหลัง
  restartTimer = () => {
    clearInterval(this.timer);
    this.setState({
      time: 60,
      count: 0,
      startVisible: true,
      restartVisible: false,
      kickVisible: false,
    });
  };
  // นับการถีบท้อง
  kickCount = () => {
    let count = this.state.count;
    count += 1;
    this.setState({ count });
  };
  // บันทึกลงฐานข้อมูล
  save = () => {
    Alert.alert("จำนวนการดิ้น : " + this.state.count);
    this.setState({
      time: 60,
      count: 0,
      startVisible: true,
      restartVisible: false,
      kickVisible: false,
      saveVisible: false,
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text>Countdown: {this.state.time}</Text>
        <Text>Kick: {this.state.count}</Text>
        {this.state.startVisible ? (
          <TouchableOpacity onPress={() => this.startTimer()}>
            <Text>Start</Text>
          </TouchableOpacity>
        ) : null}
        {this.state.restartVisible ? (
          <TouchableOpacity onPress={() => this.restartTimer()}>
            <Text>Re-Start</Text>
          </TouchableOpacity>
        ) : null}
        {this.state.kickVisible ? (
          <TouchableOpacity onPress={() => this.kickCount()}>
            <Text>kick</Text>
          </TouchableOpacity>
        ) : null}
        {this.state.saveVisible ? (
          <TouchableOpacity onPress={() => this.save()}>
            <Text>save</Text>
          </TouchableOpacity>
        ) : null}
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
