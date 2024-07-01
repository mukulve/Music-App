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

export interface ArtistData {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface Root {
  data: Daum[];
  total: number;
  next: string;
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
  contributors: Contributor[];
  md5_image: string;
  artist: Artist;
  album: Album;
  type: string;
}

export interface Contributor {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
  role: string;
}

export interface Artist {
  id: number;
  name: string;
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

export default function Page() {
  const { slug } = useLocalSearchParams();
  const [artistData, setArtistData] = useState<ArtistData | null>();
  const [artistTracks, setArtistTracks] = useState<Root | null>();

  useEffect(() => {
    fetchArtistData();
  }, [slug]);

  async function fetchArtistData() {
    const url = "https://deezerdevs-deezer.p.rapidapi.com/artist/" + slug;
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
      setArtistData(result);
      //await getArtistTracks(result.tracklist);
    } catch (error) {
      console.error(error);
    }
  }

  async function getArtistTracks(trackUrl: string) {
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "26ed9a7238msh42eb30a06cd1235p174ef8jsnae84630d35a5",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(trackUrl, options);
      const result = await response.json();
      setArtistTracks(result);
    } catch (error) {
      console.error(error);
    }
  }

  if (artistData == null) {
    <Text>Error</Text>;
  }

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView>
        <View>
          <Image
            source={{ uri: artistData?.picture_xl }}
            style={styles.hero}
          ></Image>
          <Text style={styles.miniTitle}>{artistData?.name}</Text>
        </View>
        <FlatList
          initialNumToRender={3}
          data={artistTracks?.data}
          renderItem={({ item }) => (
            <SongResult song={item} data={artistTracks?.data} />
          )}
          keyExtractor={(_, i) => i.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
