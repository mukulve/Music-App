import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

export function Rap({ navigation }) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "26ed9a7238msh42eb30a06cd1235p174ef8jsnae84630d35a5",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  let rap = [
    "1996494362",
    "6682665064",
    "10709033662",
    "1677006641",
    "10581717182",
    "7860734322",
    "3411272262",
    "9130505782",
    "10517014662",
    "3272614282",
  ];

  const [SongCovers, setSongCovers] = useState([]);
  const [PlaylistId, setPlaylistId] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      for (let i = 0; i < rap.length; i++) {
        const response = await fetch(
          "https://deezerdevs-deezer.p.rapidapi.com/playlist/" + rap[i],
          options
        );
        const data = await response.json();
        const { picture_medium, id } = data;
        if (!SongCovers.includes(picture_medium)) {
          setSongCovers((SongCovers) => [...SongCovers, picture_medium]);
          setPlaylistId((PlaylistId) => [...PlaylistId, id]);
        }
      }
    };

    fetchPlaylists();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("Playlist", { playlistId: PlaylistId[index] })
      }
    >
      <Image
        key={index}
        style={styles.cover}
        source={{
          uri: item,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.item}
      data={SongCovers}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
    />
  );
}
const styles = StyleSheet.create({
  item: {
    margin: 5,
    height: 160,
    borderRadius: 5,
  },
  cover: {
    height: 150,
    width: 150,
    borderRadius: 5,
  },
});
