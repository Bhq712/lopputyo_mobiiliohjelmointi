import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useContext } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FavoritesContext } from "./FavoritesContext";

export default function Favorites() {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {favorites.length === 0 ? (
                <Text>No favorites yet.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.imdbID}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 20 }}>

                            {/* TITLE + STAR ROW */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                    {item.Title}
                                </Text>

                                {/* ⭐ REMOVE BUTTON (same toggle) */}
                                <TouchableOpacity
                                    onPress={() => toggleFavorite(item)}
                                    style={{ marginLeft: 12 }}
                                >
                                    <FontAwesome name="star" size={30} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* POSTER */}
                            <Image
                                source={{ uri: item.Poster }}
                                style={{
                                    width: 150,
                                    height: 220,
                                    marginTop: 8,
                                    borderRadius: 8,
                                }}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
}