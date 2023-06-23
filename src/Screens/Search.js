import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import * as api from "../Api.json";
import { playSound } from "./AudioPlayer";

export function SearchScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      console.log("Unloading Sound");
      Audio.Sound.unloadAsync();
    };
  }, []);

  const options = api;
  const [text, onChangeText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchPlaylists = async () => {
    if (text.replace(/\s/g, "") !== "") {
      setLoading(true);
      const response = await fetch(
        "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + text,
        options
      );
      const reply = await response.json();
      setSearchResults(reply.data);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResult}
      onPress={() => playSound(item.preview)}
    >
      <View>
        <Image
          style={styles.coverSmall}
          source={{ uri: item.album.cover_xl }}
        />
      </View>
      <View>
        <Text style={styles.resultText}>{item.title_short}</Text>
        <Text style={styles.resultText}>{item.artist.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        onSubmitEditing={() => fetchPlaylists()}
      />
      {loading ? (
        <View>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
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
});
