import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HomeScreen } from "./src/Screens/Home";
import { SearchScreen } from "./src/Screens/Search";
import { PlaylistScreen } from "./src/Screens/Playlist";
import GLOBAL from "./src/Screens/Global.js";
import { useState, useEffect } from "react";

function Footer() {
  useEffect(() => {
    console.log("Global Changed");
  }, [GLOBAL]);
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{GLOBAL.songTitle}</Text>
      <Text style={styles.footerText}>{GLOBAL.artistName}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: { height: 80 },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Library") {
              iconName = focused ? "library" : "library-outline";
            } else {
              iconName = focused ? "list" : "list-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Playlist" component={PlaylistScreen} />
      </Tab.Navigator>
      <Footer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 10,
    paddingTop: 5,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  coverSmall: {
    height: 90,
    width: 90,
    borderRadius: 2,
  },
  searchResult: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    overflow: "hidden",
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 10,
    paddingTop: 5,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  coverSmall: {
    height: 90,
    width: 90,
    borderRadius: 2,
  },
  searchResult: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    overflow: "hidden",
  },
  footer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,

    paddingRight: 10,
  },

  footerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
