import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FastAverageColor } from "fast-average-color";
import { Link } from "expo-router";
import AudioContext from "@/components//AudioContext";
import { useContext, useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export interface PlayBack {
  didJustFinish: boolean;
  durationMillis: number;
  hasJustBeenInterrupted: boolean;
  isBuffering: boolean;
  isLoaded: boolean;
  isLooping: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  pitchCorrectionQuality: string;
  playableDurationMillis: number;
  positionMillis: number;
  progressUpdateIntervalMillis: number;
  rate: number;
  shouldCorrectPitch: boolean;
  shouldPlay: boolean;
  uri: string;
  volume: number;
}

export default function Modal() {
  const audioContext = useContext(AudioContext);
  let currentTrackIndex: number = -1;
  let tracks: any[] = [];
  let playbackStatus: PlayBack | null = null as unknown as PlayBack;
  let pause: () => void;
  let playNext: () => void;
  let playPrevious: () => void;
  let seek: (position: number) => void;
  let likeSong: (song: any) => void;
  let updateTracks: (x: any) => void;
  let isSongLiked;
  const [averageColor, setColor] = useState("#fff");
  const [tab, setTab] = useState(1);

  function toggleLyricsTab() {
    if (tab == 1 || tab == 2) {
      setTab(0);
    } else {
      setTab(1);
    }
  }

  function toggleUpNextTab() {
    if (tab == 0 || tab == 1) {
      setTab(2);
    } else {
      setTab(1);
    }
  }

  if (audioContext) {
    ({
      currentTrackIndex,
      tracks,
      playbackStatus,
      pause,
      playNext,
      playPrevious,
      seek,
      isSongLiked,
      likeSong,
      updateTracks,
    } = audioContext);
  }

  console.log(playbackStatus);

  async function getAverageColor() {
    if (currentTrackIndex == -1 || Platform.OS != "web") {
      return;
    }

    const fac = new FastAverageColor();
    fac
      .getColorAsync(tracks[currentTrackIndex].album.cover_xl)
      .then((color) => {
        setColor(color.hex);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getAverageColor();
  }, [currentTrackIndex]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <Text style={styles.miniTitle}>{item.title}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (
    tracks == null ||
    currentTrackIndex === -1 ||
    tracks.length === 0 ||
    playbackStatus == null
  ) {
    return <Text>Error</Text>;
  }

  if (tab == 0) {
    return (
      <LinearGradient colors={[averageColor, "#000"]} style={styles.main}>
        <Text style={styles.miniTitle}>Lyrics Not Available</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 40,
            alignItems: "center",
            paddingVertical: 0,
          }}
        >
          <Pressable onPress={toggleLyricsTab}>
            <Ionicons name="language" size={24} color={"#fff"} />
          </Pressable>

          <Pressable onPress={toggleUpNextTab}>
            <Ionicons name="library" size={24} color={"#fff"} />
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[averageColor, "#000"]} style={styles.main}>
      {tab == 2 && (
        <GestureHandlerRootView
          style={{
            maxHeight: 350,
            height: 350,
            maxWidth: 350,
            marginHorizontal: "auto",
          }}
        >
          <DraggableFlatList
            style={{
              flex: 1,
              overflow: "scroll",
              maxHeight: 350,
              height: 350,
              maxWidth: 350,
            }}
            data={tracks}
            renderItem={renderItem}
            keyExtractor={(_, index) => `draggable-item-${index}`}
            onDragEnd={({ data }) => updateTracks(data)}
          />
        </GestureHandlerRootView>
      )}

      {tab == 1 && (
        <Image
          style={{
            width: "100%",
            marginHorizontal: "auto",
            aspectRatio: 1 / 1,
            maxWidth: 350,
          }}
          source={{
            uri: tracks[currentTrackIndex].album.cover_xl,
          }}
        />
      )}
      <View>
        <View style={styles.flex}>
          <Text numberOfLines={1} style={styles.title}>
            {tracks[currentTrackIndex].title}
          </Text>
          <Pressable onPress={() => likeSong(tracks[currentTrackIndex])}>
            <Ionicons
              name={
                isSongLiked(tracks[currentTrackIndex]) == false
                  ? "heart"
                  : "heart-dislike"
              }
              size={40}
              color={"#fff"}
            />
          </Pressable>
        </View>
        <Link href={`/artist/${tracks[currentTrackIndex].artist.id}`}>
          <Text style={styles.miniTitle} numberOfLines={1}>
            {tracks[currentTrackIndex].artist.name}
          </Text>
        </Link>
      </View>
      <View>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={playbackStatus.durationMillis}
          value={playbackStatus.positionMillis}
          onValueChange={(value) => seek(value)}
          thumbTintColor={"#fff"}
          minimumTrackTintColor={"#fff"}
          maximumTrackTintColor={"#fff"}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 40,
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Pressable onPress={() => playPrevious()}>
            <Ionicons name="play-back" size={40} color={"#fff"} />
          </Pressable>
          <Pressable onPress={() => pause()}>
            <Ionicons
              name={playbackStatus.isPlaying == true ? "pause" : "play"}
              size={50}
              color={"#fff"}
            />
          </Pressable>
          <Pressable onPress={() => playNext()}>
            <Ionicons name="play-forward" size={40} color={"#fff"} />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 40,
          alignItems: "center",
          paddingVertical: 0,
        }}
      >
        <Pressable onPress={toggleLyricsTab}>
          <Ionicons name="language" size={24} color={"#fff"} />
        </Pressable>

        <Pressable onPress={toggleUpNextTab}>
          <Ionicons name="library" size={24} color={"#fff"} />
        </Pressable>
      </View>
    </LinearGradient>
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
    color: "white",
  },
  miniTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    color: "white",
  },
  main: {
    padding: 20,
    flex: 1,
    height: "100%",
    overflow: "scroll",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "auto",
    alignItems: "center",
  },
});
