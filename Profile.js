import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function Profile({ user, onLogout }) {
  const [profileImage, setProfileImage] = useState(null);

  // 🔹 Haetaan tallennettu profiilikuva
  useEffect(() => {
    const loadImage = async () => {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
    };
    loadImage();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    onLogout();
  };

  // 🔹 Edit profiilikuva
  const handleEdit = async () => {
    Alert.alert(
      "Edit Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: () => pickImage('camera') },
        { text: "Gallery", onPress: () => pickImage('gallery') },
        { text: "Cancel", style: 'cancel' }
      ]
    );
  };

  const pickImage = async (source) => {
    let result;

    if (source === 'camera') {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert("Camera permission denied");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    } else {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Gallery permission denied");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    }

    // tukee uusien Expo-versioiden formaattia
    let uri;
    if (!result.cancelled) {
      uri = result.uri || (result.assets && result.assets[0].uri);
      if (!uri) {
        Alert.alert("Could not get image URI");
        return;
      }

      setProfileImage(uri);
      await AsyncStorage.setItem('profileImage', uri);
    }
  };

  // 🔹 Delete profiilikuva
  const handleDelete = () => {
    Alert.alert(
      "Delete Profile Picture",
      "Are you sure you want to delete profile picture?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: async () => {
            setProfileImage(null);
            await AsyncStorage.removeItem('profileImage');
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Your profile</Text>
      
      {/* 🔹 Profiilikuva */}
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="person" size={60} color="#888" />
          </View>
        )}

        {/* 🔹 Edit-nappi */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>

        {/* 🔹 Delete-nappi näkyy vain jos profiilikuva */}
        {profileImage && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>{user}</Text>
      <Button title="Log out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  imageContainer: { marginVertical: 20, position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  placeholder: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#ddd', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'purple',
    padding: 6,
    borderRadius: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 20,
  },
});