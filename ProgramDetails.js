import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, Button, TouchableOpacity} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ProgramDetails({ route }) {
  const { movie } = route.params;

  const [details, setDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const apiKey = "2a702e03";

  // ⭐ context
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    fetch(
      "https://www.omdbapi.com/?i=" + movie.imdbID + "&apikey=" + apiKey
    )
      .then((response) => {
        if (!response.ok) throw new Error("Error when fetching details");
        return response.json();
      })
      .then((data) => setDetails(data))
      .catch((err) => console.error(err))
      .finally(() => setIsFetching(false));
  }, []);

  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text>Failed to load details.</Text>
      </View>
    );
  }

  // ⭐ tarkista onko suosikki
  const isFav = favorites.some(
    (m) => m.imdbID === details.imdbID
  );

  // ⭐ toggle
  const handleToggleFavorite = () => {
    toggleFavorite(details);
  };

  const handleWriteReview = () => {};

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.title}>{details.Title}</Text>
      <Text>Year: {details.Year}</Text>
      <Text>Actors: {details.Actors}</Text>

      <View style={styles.posterRow}>
        <Image source={{ uri: details.Poster }} style={styles.poster} />

        <View style={styles.iconReview}>
          {/* ⭐ FAVORITE BUTTON */}
           <TouchableOpacity onPress={handleToggleFavorite}>
            <FontAwesome
              name={isFav ? "star" : "star-o"}
              size={30}
              color="black"
              style={{ marginBottom: 15 }}
            />
          </TouchableOpacity>

          <Button title="Review" onPress={handleWriteReview} />
        </View>
      </View>

      <Text style={styles.plot}>Plot: {details.Plot}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  posterRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconReview: {
    marginLeft: 15,
    marginTop: 40,
  },

  poster: {
    width: 200,
    height: 300,
    marginVertical: 10,
  },

  plot: {
    marginTop: 10,
    fontSize: 16,
  },
});