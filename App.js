import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


import HomeStack from './HomeStack';
import Favorites from './Favorites';
import Reviewed from './Reviewed';
import Profile from './Profile';

const Drawer = createDrawerNavigator();

export default function App() {
  
  

 return (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeStack} />
          <Drawer.Screen name="Favorites" component={Favorites} />
          <Drawer.Screen name="Reviewed programs" component={Reviewed} />
          <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
      </NavigationContainer>
      <StatusBar style='auto' />
    </SafeAreaView>
  </SafeAreaProvider>
 );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
});
