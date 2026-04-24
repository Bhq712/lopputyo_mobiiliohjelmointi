import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { FavoritesContext } from "./FavoritesContext";
import { ReviewsContext } from "./ReviewsContext";

export default function ProgramDetails({ route }) {
  const { movie } = route.params;

  const [details, setDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const apiKey = "2a702e03";

  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { reviews, addReview } = useContext(ReviewsContext);

  useEffect(() => {
    fetch("https://www.omdbapi.com/?i=" + movie.imdbID + "&apikey=" + apiKey)
      .then((res) => res.json())
      .then((data) => setDetails(data))
      .catch((err) => console.error(err))
      .finally(() => setIsFetching(false));
  }, []);

  if (isFetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isFav = favorites.some(m => m.imdbID === details.imdbID);

  const alreadyReviewed = reviews.some(
    r => r.imdbID === details.imdbID
  );

  const handleToggleFavorite = () => {
    toggleFavorite(details);
  };

  // ❗ ALERT LOGIC (ei edit täällä)
  const handleWriteReview = () => {
    if (alreadyReviewed) {
      Alert.alert(
        "Already reviewed",
        "You have already reviewed this program!",
        [{ text: "OK" }]
      );
      return;
    }

    setShowReviewModal(true);
  };

  const handleSaveReview = () => {
    if (!reviewText.trim()) return;

    addReview(details, reviewText);
    setReviewText("");
    setShowReviewModal(false);
  };

  const handleCancel = () => {
    setReviewText("");
    setShowReviewModal(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{details.Title}</Text>
        <Text>Year: {details.Year}</Text>
        <Text>Actors: {details.Actors}</Text>

        <View style={styles.row}>
          <Image source={{ uri: details.Poster }} style={styles.poster} />

          <View style={styles.icons}>
            <TouchableOpacity onPress={handleToggleFavorite}>
              <FontAwesome
                name={isFav ? "star" : "star-o"}
                size={30}
              />
            </TouchableOpacity>

            <View style={{ marginTop: 25 }}>
              <Button title="Review" onPress={handleWriteReview} />
            </View>
          </View>
        </View>

        <Text style={styles.plot}>{details.Plot}</Text>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Write review</Text>

            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Save" onPress={handleSaveReview} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  row: { flexDirection: "row" },
  poster: { width: 200, height: 300 },
  icons: { marginLeft: 15, marginTop: 40 },
  plot: { marginTop: 10 },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    padding: 10,
    minHeight: 80,
    marginBottom: 10
  }
});