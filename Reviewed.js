import { View, Text, FlatList, Image, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { ReviewsContext } from "./ReviewsContext";
import Feather from "@expo/vector-icons/Feather";

export default function Reviewed() {
  const { reviews, removeReview, updateReview } = useContext(ReviewsContext);

  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = (item) => {
    setSelected(item);
    setText(item.reviewText);
    setModalVisible(true);
  };

  const handleSave = () => {
    updateReview(selected.imdbID, text);
    setModalVisible(false);
    setSelected(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelected(null);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {reviews.length === 0 ? (
        <Text>No reviews yet</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={styles.card}>

              <View style={styles.row}>
                <Text style={styles.title}>{item.title}</Text>

                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Feather name="edit" size={23} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removeReview(item.imdbID)}>
                  <Feather name="trash-2" size={23} />
                </TouchableOpacity>
              </View>

              <Image source={{ uri: item.poster }} style={styles.poster} />

              <Text style={styles.text}>{item.reviewText}</Text>

            </View>
          )}
        />
      )}

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Edit review</Text>

            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Save" onPress={handleSave} />
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontWeight: "bold", fontSize: 16 },
  poster: { width: 120, height: 180, marginTop: 10 },
  text: { marginTop: 5 },

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