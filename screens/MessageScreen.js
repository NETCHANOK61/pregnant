import React from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import CountKickScreen from "./CountKickScreen";
import ReportScreen from "./ReportScreen";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

// class MainScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Button
//           title="นับลูกดิ้น"
//           onPress={() => this.props.navigation.navigate("Kick")}
//         />
//         <Button
//           title="รายงานคุณหมอ"
//           onPress={() => this.props.navigation.navigate("Reported")}
//         />
//       </View>
//     );
//   }
// }

// const RootStack = createStackNavigator(
//   {
//     Kick: CountKickScreen,
//     Main: MainScreen,
//     Reported: ReportScreen,
//   },
//   {
//     initialRouteName: "Main",
//   }
// );
// const AppContainer = createAppContainer(RootStack);

export default class MessageScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Other</Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Kick")}
          >
            <Text>นับลูกดิ้น</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Report")}
          >
            <Text>รายงานแพทย์</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});
