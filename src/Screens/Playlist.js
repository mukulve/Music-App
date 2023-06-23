import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import * as api from "../Api.json";
import { playSound } from "./AudioPlayer";

export function PlaylistScreen({ route, navigation }) {
  useEffect(() => {
    return () => {
      console.log("Unloading Sound");
      Audio.Sound.unloadAsync();
    };
  }, []);

  const { playlistId } = route.params;

  const [previewArr, setPreview] = useState([]);
  const [titleArr, setTitle] = useState([]);
  const [coverArr, setCover] = useState([]);
  const [nameArr, setName] = useState([]);

  const [playlistCover, setPlaylistCover] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchPlaylists = async () => {
    setLoading(true);
    const options = api;

    const response = await fetch(
      "https://deezerdevs-deezer.p.rapidapi.com/playlist/" + playlistId,
      options
    );
    const reply = await response.json();
    let { picture_medium, description, title } = reply;

    setPlaylistTitle(title);
    setPlaylistCover(picture_medium);
    setPlaylistDescription(description);

    for (let i = 0; i < reply.tracks.data.length; i++) {
      console.log(i);
      let { cover_xl } = reply.tracks.data[i].album;
      let { title, preview } = reply.tracks.data[i];
      let { name } = reply.tracks.data[i].artist;

      setPreview((previewArr) => [...previewArr, preview]);
      setTitle((titleArr) => [...titleArr, title]);
      setCover((coverArr) => [...coverArr, cover_xl]);
      setName((nameArr) => [...nameArr, name]);
    }
    console.log("Done");
    setLoading(false);
  };

  useEffect(() => {
    console.log("CHECK");
    fetchPlaylists();
  }, [playlistId]);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.searchResult}
        onPress={() => playSound(previewArr[index])}
      >
        <View>
          <Image
            style={styles.coverSmall}
            source={{
              uri: coverArr[index],
            }}
          />
        </View>
        <View>
          <Text style={styles.resultText}>{titleArr[index]}</Text>
          <Text style={styles.resultText}>{nameArr[index]}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.body}>
      {loading == true ? (
        <View>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={previewArr}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
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
});
