import { View, Text, Button } from 'react-native';

export default function Profile({ user, onLogout }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Your profile</Text>
      <Text style={{ fontSize: 18, fontStyle: "italic"}}>{user}</Text>

      <Button title="Logout" onPress={onLogout} />
    </View>
  );
}