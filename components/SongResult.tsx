import {
  StyleSheet,
  Image,
  Text,
  View,
  Pressable,
  useColorScheme,
} from "react-native";
import AudioContext from "./AudioContext";
import { useContext } from "react";

export interface Prop {
  song: any;
  data: any;
}

export function SongResult(prop: Prop) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;

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
        <Text style={[styles.miniTitle, themeTextStyle]}>
          {prop.song.title}
        </Text>
        <Text style={themeTextStyle}>{prop.song.artist.name}</Text>
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
  lightThemeText: {
    color: "#050316",
  },
  darkThemeText: {
    color: "#EBE9FC",
  },
});
