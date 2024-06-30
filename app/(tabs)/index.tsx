import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlbumCover } from "@/components/AlbumCover";

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
  title_version?: string;
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

export default function HomeScreen() {
  const rap = ["6682665064", "1677006641", "3188520162", "10434450042"];
  const lofi = ["3338949242", "1306085715", "8749345882", "2994534926"];
  const workout = ["2153050122", "1719648481", "2532117644", "767396371"];
  const charts = ["3155776842", "1313621735", "1652248171", "1362508575"];

  const [rapData, setRapData] = useState<Root[]>([]);
  const [lofiData, setLofiData] = useState<Root[]>([]);
  const [workoutData, setWorkoutData] = useState<Root[]>([]);
  const [chartsData, setChartsData] = useState<Root[]>([]);

  async function playlistData(id: String) {
    const url = "https://deezerdevs-deezer.p.rapidapi.com/playlist/" + id;
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
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all(rap.map((id) => playlistData(id)))
      .then((data) => setRapData(data))
      .catch((error) => console.error(error));

    Promise.all(lofi.map((id) => playlistData(id)))
      .then((data) => setLofiData(data))
      .catch((error) => console.error(error));

    Promise.all(workout.map((id) => playlistData(id)))
      .then((data) => setWorkoutData(data))
      .catch((error) => console.error(error));

    Promise.all(charts.map((id) => playlistData(id)))
      .then((data) => setChartsData(data))
      .catch((error) => console.error(error));

    return () => {
      setRapData([]);
      setLofiData([]);
      setWorkoutData([]);
      setChartsData([]);
    };
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.title}>Home</Text>
      <ScrollView>
        <View>
          <Text style={styles.miniTitle}>HipHop</Text>
          <FlatList
            initialNumToRender={3}
            data={rapData}
            renderItem={({ item }) => <AlbumCover album={item} />}
            keyExtractor={(_, i) => i.toString()}
            horizontal
          />
        </View>
        <View>
          <Text style={styles.miniTitle}>Lofi</Text>
          <FlatList
            initialNumToRender={3}
            data={lofiData}
            renderItem={({ item }) => <AlbumCover album={item} />}
            keyExtractor={(_, i) => i.toString()}
            horizontal
          />
        </View>
        <View>
          <Text style={styles.miniTitle}>Workout</Text>
          <FlatList
            initialNumToRender={3}
            data={workoutData}
            renderItem={({ item }) => <AlbumCover album={item} />}
            keyExtractor={(_, i) => i.toString()}
            horizontal
          />
        </View>
        <View>
          <Text style={styles.miniTitle}>Charts</Text>
          <FlatList
            initialNumToRender={3}
            data={chartsData}
            renderItem={({ item }) => <AlbumCover album={item} />}
            keyExtractor={(_, i) => i.toString()}
            horizontal
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
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
