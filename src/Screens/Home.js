import { StyleSheet, Text, ScrollView } from "react-native";
import { Lofi } from "../Playlists/Lofi_playlist";
import { Rap } from "../Playlists/Rap_playlist";
import { Charts } from "../Playlists/Charts_playlist";
import { Raggae } from "../Playlists/Reggae_playlist";

export function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.body}>
      <Text style={styles.title}>Lofi</Text>
      <Lofi navigation={navigation} />
      <Text style={styles.title}>Rap</Text>
      <Rap navigation={navigation} />
      <Text style={styles.title}>Top Charts</Text>
      <Charts navigation={navigation} />
      <Text style={styles.title}>Raggae</Text>
      <Raggae navigation={navigation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 10,
    paddingTop: 5,
  },
});
