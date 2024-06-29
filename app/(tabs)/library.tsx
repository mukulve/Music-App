import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AudioContext from "@/components//AudioContext";
import { useContext } from "react";
import { SongResult } from "@/components/SongResult";

export default function HomeScreen() {
  const audioContext = useContext(AudioContext);
  let currentTrackIndex,
    recent: ArrayLike<any> | null | undefined,
    liked: ArrayLike<any> | null | undefined;
  if (audioContext) {
    ({ currentTrackIndex, recent, liked } = audioContext);
  }

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.miniTitle}>Liked</Text>
        <FlatList
          data={liked}
          renderItem={({ item }) => <SongResult song={item} data={liked} />}
          keyExtractor={(_, i) => i.toString()}
        />
        <Text style={styles.miniTitle}>Recent</Text>
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
});
