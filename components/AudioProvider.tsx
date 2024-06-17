import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import AudioContext from "./AudioContext";

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

export default function AudioProvider({ children }: { children: any }) {
  const [sound, setSound] = useState<any>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [playbackStatus, setPlaybackStatus] = useState<PlayBack>();
  const [tracks, setTracks] = useState<any[] | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  async function playSound(song: any, data: any) {
    let preview = song.preview;
    let trackData = data;
    let index = trackData.findIndex(
      (track: { preview: String }) => track.preview === preview
    );

    setRecent((prev) =>
      prev.some((s) => s.preview === song.preview) ? prev : [...prev, song]
    );
    setCurrentTrackIndex(index);
    setTracks(trackData);

    let soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: preview });
      await soundObject.playAsync();
      setSound(soundObject);
    } catch (error) {
      console.log("Error playing sound", error);
    }
  }

  function playNext() {
    if (tracks === null) return;

    if (currentTrackIndex < tracks.length - 1) {
      playSound(tracks[currentTrackIndex + 1], tracks);
    }
  }

  function playPrevious() {
    if (tracks === null) return;

    if (currentTrackIndex > 0) {
      playSound(tracks[currentTrackIndex - 1], tracks);
    }
  }

  async function pause() {
    let status = await sound.getStatusAsync();

    if (status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }

  async function seek(position: number) {
    try {
      await sound.setPositionAsync(position);
    } catch (error) {
      console.log("Error seeking sound", error);
    }
  }

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status: any) => {
        setPlaybackStatus(status);
        if (status.didJustFinish) {
          playNext();
        }
      });
    }

    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{
        playSound,
        currentTrackIndex,
        tracks,
        recent,
        pause,
        playNext,
        playPrevious,
        sound,
        playbackStatus,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
