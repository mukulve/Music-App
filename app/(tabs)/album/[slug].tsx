import { useLocalSearchParams } from "expo-router";

import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { SongResult } from "@/components/SongResult";
import AudioContext from "@/components/AudioContext";
import { useContext } from "react";

export interface Root {
  id: number;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  creator: Creator;
  type: string;
  tracks: Tracks;
}

export interface Creator {
  id: number;
  name: string;
  tracklist: string;
  type: string;
}

export interface Tracks {
  data: Daum[];
  checksum: string;
}

export interface Daum {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  time_add: number;
  artist: Artist;
  album: Album;
  type: string;
}

export interface Artist {
  id: number;
  name: string;
  link: string;
  tracklist: string;
  type: string;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: string;
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
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
  hero: {
    width: "50%",
    margin: "auto",
    aspectRatio: 1 / 1,
    maxWidth: 300,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  button: {
    maxWidth: "50%",
    minWidth: "40%",
    padding: 15,
    backgroundColor: "#DDDDDD",
  },
  extraMiniTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
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

export default function Page() {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const [albumData, setAlbumData] = useState<Root | null>();
  const { slug } = useLocalSearchParams();
  let playSound: (song: any, data: any) => void;
  const audioContext = useContext(AudioContext);
  if (audioContext) {
    ({ playSound } = audioContext);
  }

  useEffect(() => {
    fetchAlbumData();
  }, [slug]);

  async function fetchAlbumData() {
    const url = "https://deezerdevs-deezer.p.rapidapi.com/playlist/" + slug;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "26ed9a7238msh42eb30a06cd1235p174ef8jsnae84630d35a5",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setAlbumData(result);
    } catch (error) {
      console.error(error);
    }
  }

  function shuffleAlbum() {
    let songs = albumData?.tracks.data;
    if (songs == undefined) return;
    shuffleArray(songs);
    playSound(songs[0], songs);
  }

  function shuffleArray(array: any[]) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  if (albumData == null) {
    <Text>Error</Text>;
  }

  return (
    <SafeAreaView style={[styles.main, themeContainerStyle]}>
      <ScrollView>
        <View>
          <Image
            source={{ uri: albumData?.picture_xl }}
            style={styles.hero}
          ></Image>
          <Text style={[styles.miniTitle, themeTextStyle]}>
            {albumData?.description}
          </Text>
          <View style={styles.flex}>
            <TouchableOpacity
              style={[styles.button, themeContainerStyle]}
              onPress={() =>
                playSound(albumData?.tracks.data[0], albumData?.tracks.data)
              }
            >
              <Text style={[styles.extraMiniTitle, themeTextStyle]}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, themeContainerStyle]}
              onPress={shuffleAlbum}
            >
              <Text style={[styles.extraMiniTitle, themeTextStyle]}>
                Shuffle
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          initialNumToRender={3}
          data={albumData?.tracks.data}
          renderItem={({ item }) => (
            <SongResult song={item} data={albumData?.tracks.data} />
          )}
          keyExtractor={(_, i) => i.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
