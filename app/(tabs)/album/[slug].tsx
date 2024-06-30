import Root from "@/app/+html";
import { useLocalSearchParams } from "expo-router";

import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { SongResult } from "@/components/SongResult";

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
});

export default function Page() {
  const [albumData, setAlbumData] = useState<Root | null>();
  const { slug } = useLocalSearchParams();

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

  if (albumData == null) {
    <Text>Error</Text>;
  }

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView>
        <View>
          <Image
            source={{ uri: albumData?.picture_xl }}
            style={styles.hero}
          ></Image>
          <Text style={styles.miniTitle}>{albumData?.description}</Text>
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
