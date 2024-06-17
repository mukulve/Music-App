import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SongResult } from "@/components/SongResult";

import { useEffect, useState } from "react";

export default function TabTwoScreen() {
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState(0);

  async function search() {
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${textInputValue}`;
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
      setNextPage(25);
      setSearchResults(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMore() {
    const url =
      "https://deezerdevs-deezer.p.rapidapi.com/search?q=" +
      textInputValue +
      "&next=" +
      25 +
      "&index=" +
      nextPage;

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

      if (result.data.length == 0) return;

      setNextPage(nextPage + 25);
      setSearchResults([...searchResults, ...result.data]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (textInputValue === "") setSearchResults([]);

    const timeout = setTimeout(() => {
      search();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [textInputValue]);

  if (isTextInputFocused === true) {
    return (
      <SafeAreaView style={styles.main}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.flex}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={textInputValue}
            onChangeText={setTextInputValue}
            placeholder="Artist, Songs, Lyrics, and More"
            onSubmitEditing={search}
            autoFocus={true}
          ></TextInput>
          <Button title="Cancel" onPress={() => setIsTextInputFocused(false)} />
        </View>
        <View style={{ width: "100%", height: "100%" }}>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <SongResult song={item} data={searchResults} />
            )}
            keyExtractor={(_, i) => i.toString()}
            onEndReached={loadMore}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.main}>
        <View>
          <Text style={styles.title}>Search</Text>
          <TextInput
            style={styles.input}
            onFocus={() => setIsTextInputFocused(true)}
            onBlur={() => setIsTextInputFocused(false)}
            value={textInputValue}
            onChangeText={setTextInputValue}
            placeholder="Artist, Songs, Lyrics, and More"
          ></TextInput>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  flex: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
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
  },
});
