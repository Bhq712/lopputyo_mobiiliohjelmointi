import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    //tämä lataa favorites-listan kun sovellus käynnistyy
    useEffect(() => {
        const loadFavorites = async () => {
            const data = await AsyncStorage.getItem("favorites");
            if (data) {
                setFavorites(JSON.parse(data));
            }
        };
        loadFavorites();
    }, []);

    //tallennetaan
    const saveFavorites = async (list) => {
        await AsyncStorage.setItem("favorites", JSON.stringify(list));
    };

    //lisää suosikki
    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            if (prev.find((m) => m.imdbID === movie.imdbID)) {
                return prev;
            }

            const updated = [...prev, movie];
            saveFavorites(updated);
            return updated;
        });
    };

    const toggleFavorite = (movie) => {
        setFavorites((prev) => {
            const exists = prev.find((m) => m.imdbID === movie.imdbID);

            let updated;

            if (exists) {
                // poista
                updated = prev.filter((m) => m.imdbID !== movie.imdbID);
            } else {
                // lisää
                updated = [...prev, movie];
            }

            saveFavorites(updated);
            return updated;
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

