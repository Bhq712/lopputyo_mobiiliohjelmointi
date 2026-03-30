import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function Home({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [programs, setPrograms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const apiKey = '2a702e03';

  const handleFetch = () => {
    if (!keyword) {
      Alert.alert('Enter keyword first');
      return;
    }
    setIsFetching(true);

    fetch(`https://www.omdbapi.com/?s=${keyword}&apikey=${apiKey}`)
      .then(res => res.json())
      .then(data => setPrograms(data.Search || []))
      .catch(err => console.error(err))
      .finally(() => setIsFetching(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProgramDetails', { movie: item })}>
      <View style={styles.movieCard}>
        <Image source={{ uri: item.Poster }} style={styles.poster} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text>{item.Year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search programs..."
        value={keyword}
        onChangeText={text => setKeyword(text)}
      />
      <Button title="Fetch" onPress={handleFetch} color="purple" disabled={isFetching} />

      {isFetching ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={programs}
          keyExtractor={item => item.imdbID}
          renderItem={renderItem}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  movieCard: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  poster: { width: 60, height: 90, marginRight: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
});