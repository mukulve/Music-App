import {
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AudioContext from "@/components//AudioContext";
import { useContext } from "react";
import { SongResult } from "@/components/SongResult";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const audioContext = useContext(AudioContext);
  let currentTrackIndex,
    recent: ArrayLike<any> | null | undefined,
    liked: ArrayLike<any> | null | undefined;
  if (audioContext) {
    ({ currentTrackIndex, recent, liked } = audioContext);
  }

  return (
    <SafeAreaView style={[styles.main, themeContainerStyle]}>
      <Text style={[styles.title, themeTextStyle]}>Library</Text>
      <ScrollView>
        <Text style={[styles.miniTitle, themeTextStyle]}>Liked</Text>
        <FlatList
          data={liked}
          renderItem={({ item }) => <SongResult song={item} data={liked} />}
          keyExtractor={(_, i) => i.toString()}
        />
        <Text style={[styles.miniTitle, themeTextStyle]}>Recent</Text>
        <FlatList
          data={recent}
          renderItem={({ item }) => <SongResult song={item} data={recent} />}
          keyExtractor={(_, i) => i.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  miniTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  main: {
    padding: 10,
    flex: 1,
    height: "100%",
    overflow: "scroll",
  },
  lightContainer: {
    backgroundColor: "#FBFBFE",
  },
  darkContainer: {
    backgroundColor: "#010104",
  },
  lightThemeText: {
    color: "#050316",
  },
  darkThemeText: {
    color: "#EBE9FC",
  },
});
