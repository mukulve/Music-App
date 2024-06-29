import { StyleSheet, Image, Pressable } from "react-native";
import { router } from "expo-router";

export function AlbumCover(prop: any) {
  function handleClick() {
    router.push(`/album/${prop.album.id}`);
  }

  return (
    <Pressable style={{ marginRight: 8 }} onPress={handleClick}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: prop.album.picture_medium,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 150,
    height: 150,
  },
});
