import { StyleSheet, Image, Text, View, Pressable } from "react-native";
import AudioContext from "./AudioContext";
import { useContext } from "react";

export interface Prop {
  song: any;
  data: any;
}

export function SongResult(prop: Prop) {
  const audioContext = useContext(AudioContext);
  let playSound: (song: any, data: any) => void;

  if (audioContext) {
    ({ playSound } = audioContext);
  }
  return (
    <Pressable
      style={styles.flex}
      onPress={() => playSound(prop.song, prop.data)}
    >
      <Image
        style={styles.tinyLogo}
        source={{
          uri: prop.song.album.cover_medium,
        }}
      />
      <View>
        <Text style={styles.miniTitle}>{prop.song.title}</Text>
        <Text>{prop.song.artist.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
  },
  flex: {
    flexDirection: "row",
    gap: 10,
    alignContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  miniTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
