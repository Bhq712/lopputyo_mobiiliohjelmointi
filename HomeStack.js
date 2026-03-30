import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import ProgramDetails from './ProgramDetails';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={Home} options={{ title: 'Program search' }} />
      <Stack.Screen name="ProgramDetails" component={ProgramDetails} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}