import { Audio } from "expo-av";
import GLOBAL from "./Global.js";

let soundObject = null;

export async function playSound(p) {
  GLOBAL.songTitle = "Test";
  GLOBAL.artistName = "Test";

  if (soundObject) {
    console.log("Stopping current sound");
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  }

  console.log("Loading Sound");
  soundObject = new Audio.Sound();
  await soundObject.loadAsync({ uri: p });
  await soundObject.playAsync();
  console.log("Playing Sound");
}
