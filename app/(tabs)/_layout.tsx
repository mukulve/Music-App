import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AudioContext from "@/components//AudioContext";
import { useContext, useState, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";

export default function TabLayout() {
  const audioContext = useContext(AudioContext);
  let currentTrackIndex: number = -1;
  let tracks: any[] = [];
  let pause: () => void;
  let playNext: () => void;
  if (audioContext) {
    ({ currentTrackIndex, tracks, pause, playNext } = audioContext);
  }

  const insets = useSafeAreaInsets();
  const [averageColor, setColor] = useState("#fff");
  const [isDark, setIsDark] = useState("#000");

  function openModal() {
    router.push("modal");
  }

  async function getAverageColor() {
    if (currentTrackIndex == -1) {
      return;
    }

    const fac = new FastAverageColor();
    fac
      .getColorAsync(tracks[currentTrackIndex].album.cover_xl)
      .then((color) => {
        setColor(color.hex);
        color.isDark ? setIsDark("#fff") : setIsDark("#000");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getAverageColor();
  }, [currentTrackIndex]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "albums" : "albums-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "search" : "search-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="album/[slug]"
          options={{
            title: "album",
            tabBarItemStyle: {
              display: "none",
            },
          }}
        />
      </Tabs>
      {tracks && (
        <Pressable
          style={{
            position: "absolute",
            bottom: insets.bottom + 45,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: averageColor,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onPress={openModal}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={{
                uri: tracks[currentTrackIndex].album.cover_xl,
              }}
            />
            <Text
              numberOfLines={1}
              style={[{ color: isDark }, styles.miniTitle]}
            >
              {tracks[currentTrackIndex].title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => pause()}>
              <Ionicons name="play" size={24} color={isDark} />
            </Pressable>
            <Pressable onPress={() => playNext()}>
              <Ionicons name="play-forward" size={24} color={isDark} />
            </Pressable>
          </View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  flex: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  miniTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 5,
  },
  main: {
    padding: 10,
    flex: 1,
    height: "100%",
    overflow: "scroll",
  },
});
