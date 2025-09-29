/**
 * dashboard.tsx
 * 
 * This file contains the Dashboard component which serves as the main screen after login.
 * It displays buttons for sending an SOS alert, managing contacts, and accessing settings.
 * The SOS button notifies all saved contacts.
 */

import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Dashboard() {
  const router = useRouter();

  const handleSOS = async () => {
    if (!auth.currentUser) return;

    const snapshot = await getDocs(
      collection(db, `users/${auth.currentUser.uid}/contacts`)
    );

    const latestContacts = snapshot.docs.map((doc) => ({
      name: doc.data().name,
      email: doc.data().email,
    }));

    if (latestContacts.length === 0) {
      Alert.alert("SOS", "No contacts to notify.");
      return;
    }

    const names = latestContacts.map((c) => c.name).join(", ");

    // Mobile alert
    Alert.alert("🚨 SOS Sent!", `Notified: ${names}`);

    // Web alert fallback
    if (typeof window !== "undefined") {
      window.alert(`🚨 SOS Sent! Notified: ${names}`);
    }

    console.log(
      "📢 SOS sent to:",
      latestContacts.map((c) => `${c.name} <${c.email}>`).join(", ")
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F5F5F5" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 30,
          color: "#333",
        }}
      >
        Dashboard
      </Text>

      {/* SOS Button (Top) */}
      <TouchableOpacity
        onPress={handleSOS}
        style={{
          backgroundColor: "#FF5252",
          padding: 20,
          borderRadius: 15,
          alignItems: "center",
          marginBottom: 40, // Add extra spacing below
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
          🚨 Send SOS
        </Text>
      </TouchableOpacity>

      {/* Other Buttons (pushed downwards) */}
      <TouchableOpacity
        onPress={() => router.push("/contacts")}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Manage Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/profile")}
        style={{
          backgroundColor: "#FF9800",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/settings")}
        style={{
          backgroundColor: "#2196F3",
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
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
