import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";

import ProfileScreen from "./screens/ProfileScreen";
import PostScreen from "./screens/PostScreen";
import MessageScreen from "./screens/MessageScreen";
import NotificationScreen from "./screens/NotificationScreen";

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "Login",
  }
);
const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="home" size={24} color={tintColor} />
            ),
          },
        },
        Message: {
          screen: MessageScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="chatbox" size={24} color={tintColor} />
            ),
          },
        },
        Post: {
          screen: PostScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons
                name="add-circle"
                size={48}
                color="#E9446A"
                style={{
                  shadowColor: "#E9446A",
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 10,
                  shadowOpacity: 0.3,
                }}
              />
            ),
          },
        },
        Notification: {
          screen: NotificationScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="notifications" size={24} color={tintColor} />
            ),
          },
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="person" size={24} color={tintColor} />
            ),
          },
        },
      },
      {
        defaultNavigationOptions: {
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            if (navigation.state.key === "Post") {
              navigation.navigate("postModal");
            } else {
              defaultHandler();
            }
          },
        },
        tabBarOptions: {
          activeTintColor: "#161F3D",
          inactiveTintColor: "#B8BBC4",
          showLabel: false,
        },
        initialRouteName:"Home"
      }
    ),
    postModal: {
      screen: PostScreen,
    },
  },
  {
    mode: "modal",
    headerMode: "none",
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack,
    },
    {
      initialRouteName: "Loading",
    }
  )
);
