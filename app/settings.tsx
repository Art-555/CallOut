/**
 * settings.tsx
 * 
 * This file contains the Settings component which allows users to log out.
 * It includes a logout button that signs out the user from Firebase Auth
 * and navigates back to the login screen.
 */

import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F5F5F5" }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          padding: 10,
          backgroundColor: "#fff",
          borderRadius: 8,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#333" }}>← Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#FF5252",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
