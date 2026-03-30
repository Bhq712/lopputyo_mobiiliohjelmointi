import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeStack from './HomeStack';
import Favorites from './Favorites';
import Reviewed from './Reviewed';
import Profile from './Profile';
import Login from './Login';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const checkLogin = async () => {
      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setUser(savedUser);
        setIsLoggedIn(true);
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

 
  if (loading) {
    return null;
  }

 
  if (!isLoggedIn) {
    return (
      <Login
        onLogin={async (username) => {
          setUser(username);
          setIsLoggedIn(true);

          
          await AsyncStorage.setItem('user', username);
        }}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="Favorites" component={Favorites} />
            <Drawer.Screen name="Reviewed programs" component={Reviewed} />
            <Drawer.Screen name="Profile">
              {() => (
                <Profile
                  user={user}
                  onLogout={async () => {
                    await AsyncStorage.removeItem('user');
                    setIsLoggedIn(false);
                  }}
                />
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});