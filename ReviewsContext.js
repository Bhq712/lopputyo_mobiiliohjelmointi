import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  // 📥 load
  useEffect(() => {
    const loadReviews = async () => {
      const data = await AsyncStorage.getItem("reviews");
      if (data) {
        setReviews(JSON.parse(data));
      }
    };
    loadReviews();
  }, []);

  // 💾 save
  const saveReviews = async (list) => {
    await AsyncStorage.setItem("reviews", JSON.stringify(list));
  };

  // ➕ add
  const addReview = (movie, text) => {
    setReviews((prev) => {
      const newReview = {
        imdbID: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
        reviewText: text,
      };

      const updated = [...prev, newReview];
      saveReviews(updated);
      return updated;
    });
  };

  // ✏️ update
  const updateReview = (id, newText) => {
    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.imdbID === id ? { ...r, reviewText: newText } : r
      );
      saveReviews(updated);
      return updated;
    });
  };

  // 🗑️ remove
  const removeReview = (id) => {
    setReviews((prev) => {
      const updated = prev.filter((r) => r.imdbID !== id);
      saveReviews(updated);
      return updated;
    });
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, updateReview, removeReview }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};