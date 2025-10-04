/**
 * addContact.tsx
 * 
 * This file contains the AddContact component which allows users to add a new contact.
 * It includes a form with a text input for the contact's name and a save button.
 * When the save button is pressed, the contact is added to the Firestore database
 * under the current user's contacts collection.
 */


import { useRouter } from "expo-router";
import { addDoc, collection, endAt, getDocs, orderBy, query, startAt } from "firebase/firestore";
import { useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function AddContact() {
  const router = useRouter();
  const [searchEmail, setSearchEmail] = useState("");
  const [results, setResults] = useState([]);
  const [nicknameMap, setNicknameMap] = useState({});

  // Search users by email (starts-with)
  const handleSearch = async (text) => {
    setSearchEmail(text);
    if (!text) {
      setResults([]);
      return;
    }

    const q = query(
      collection(db, "users"),
      orderBy("email"),
      startAt(text),
      endAt(text + "\uf8ff")
    );

    const snapshot = await getDocs(q);
    setResults(snapshot.docs.map((doc) => Object.assign({ uid: doc.id }, doc.data())));
  };

  const handleAdd = async (user) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "users/" + auth.currentUser.uid + "/contacts"), {
        uid: user.uid,
        email: user.email,
        name: nicknameMap[user.uid] || user.email,
      });

      Alert.alert("Added", (nicknameMap[user.uid] || user.email) + " saved!");
      router.replace("/contacts");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F5F5F5" }}>
      
      {/* Back Button */}
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

      {/* Search Input */}
      <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 16 }}>Search by Email</Text>
      <TextInput
        value={searchEmail}
        onChangeText={handleSearch}
        placeholder="Type email..."
        autoCapitalize="none"
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
          elevation: 1,
        }}
      />

      {/* Search Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 12,
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "#333" }}>
              {nicknameMap[item.uid] || item.email}
            </Text>
            <Text style={{ color: "#888", marginBottom: 8 }}>{item.email}</Text>

      <TextInput
        placeholder="Enter nickname"
        value={nicknameMap[item.uid] || ""}
        onChangeText={(text) =>
          setNicknameMap(function (prev) { return Object.assign(Object.assign({}, prev), { [item.uid]: text }); })
        }
        style={{
          backgroundColor: "#F0F0F0",
          padding: 10,
          borderRadius: 10,
          marginBottom: 8,
        }}
      />

            <TouchableOpacity
              onPress={() => handleAdd(item)}
              style={{
                backgroundColor: "#FF5A5F",
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
