import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FastAverageColor } from "fast-average-color";

import AudioContext from "@/components//AudioContext";
import { useContext, useEffect, useState } from "react";
import Slider from "@react-native-community/slider";

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

  const [averageColor, setColor] = useState("#fff");
  const [isDark, setIsDark] = useState("#000");

  if (audioContext) {
    ({
      currentTrackIndex,
      tracks,
      playbackStatus,
      pause,
      playNext,
      playPrevious,
      seek,
    } = audioContext);
  }

  async function getAverageColor() {
    if (currentTrackIndex == -1) {
      return;
    }

    const fac = new FastAverageColor();
    fac
      .getColorAsync(tracks[currentTrackIndex].album.cover_xl)
      .then((color) => {
        setColor(color.hex);
        color.isDark ? setIsDark("#fff") : setIsDark("#000");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getAverageColor();
  }, [currentTrackIndex]);

  if (
    tracks == null ||
    currentTrackIndex === -1 ||
    tracks.length === 0 ||
    playbackStatus == null
  ) {
    return <View />;
  }

  return (
    <View
      style={[
        {
          backgroundColor: averageColor,
          height: "100%",
        },
        styles.main,
      ]}
    >
      <Image
        style={{
          width: "100%",
          margin: "auto",
          aspectRatio: 1 / 1,
        }}
        source={{
          uri: tracks[currentTrackIndex].album.cover_xl,
        }}
      />
      <Text style={[{ color: isDark }, styles.title]}>
        {tracks[currentTrackIndex].title}
      </Text>
      <Text style={[{ color: isDark }, styles.miniTitle]}>
        {tracks[currentTrackIndex].artist.name}
      </Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={playbackStatus.durationMillis}
        value={playbackStatus.positionMillis}
        onValueChange={(value) => seek(value)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 40,
          alignItems: "center",
          padding: 40,
        }}
      >
        <Pressable onPress={() => playPrevious()}>
          <Ionicons name="play-back" size={40} color={isDark} />
        </Pressable>
        <Pressable onPress={() => pause()}>
          <Ionicons name="play" size={50} color={isDark} />
        </Pressable>
        <Pressable onPress={() => playNext()}>
          <Ionicons name="play-forward" size={40} color={isDark} />
        </Pressable>
      </View>
    </View>
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
  },
  miniTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  main: {
    padding: 20,
    flex: 1,
    height: "100%",
    overflow: "scroll",
  },
});
