import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SongResult } from "@/components/SongResult";

import { useEffect, useState } from "react";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState(0);
  const [recentSearches, setRecentSearches] = useState<String[]>([]);

  async function search() {
    if (textInputValue === "" || textInputValue.length === 0) return;

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
      setRecentSearches([...recentSearches, textInputValue]);
      search();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [textInputValue]);

  if (isTextInputFocused === true) {
    return (
      <SafeAreaView style={[styles.main, themeContainerStyle]}>
        <Text style={[styles.title, themeTextStyle]}>Search</Text>
        <View style={styles.flex}>
          <TextInput
            style={[styles.input, { flex: 1 }, themeTextStyle]}
            value={textInputValue}
            onChangeText={setTextInputValue}
            placeholder="Artist, Songs, Lyrics, and More"
            onSubmitEditing={search}
            autoFocus={true}
          ></TextInput>
          <Button
            title="Cancel"
            onPress={() => {
              setIsTextInputFocused(false);
              setTextInputValue("");
            }}
          />
        </View>
        {textInputValue == "" && (
          <ScrollView style={{ flex: 1 }}>
            <Text style={[styles.miniTitle, themeTextStyle]}>
              Recently Searched
            </Text>
            <View style={{ width: "100%", height: "100%" }}>
              <FlatList
                data={Array.from(new Set(recentSearches)).reverse()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setTextInputValue(item.toLowerCase())}
                  >
                    <Text style={styles.recentSearch}>{item}</Text>
                  </Pressable>
                )}
                keyExtractor={(_, i) => i.toString()}
              />
            </View>
          </ScrollView>
        )}
        {textInputValue != "" && (
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
        )}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={[styles.main, themeContainerStyle]}>
        <View>
          <Text style={[styles.title, themeTextStyle]}>Search</Text>
          <TextInput
            style={[styles.input, themeTextStyle]}
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
  recentSearch: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 5,
  },
  main: {
    padding: 10,
    flex: 1,
    height: "100%",
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
