/**
 * contacts.tsx
 * 
 * This file contains the Contacts component which displays a list of the user's contacts.
 * It fetches contacts from Firestore under the current user's contacts collection.
 * Users can add new contacts, edit existing ones, or delete contacts from the list.
 */

import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

type Contact = {
  id: string;
  uid: string;
  email: string;
  name: string;
};

export default function Contacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = async () => {
    if (!auth.currentUser) return;
    const snapshot = await getDocs(
      collection(db, `users/${auth.currentUser.uid}/contacts`)
    );
    setContacts(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid,
        email: doc.data().email,
        name: doc.data().name,
      }))
    );
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, `users/${auth.currentUser.uid}/contacts/${id}`));
    loadContacts();
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F5F5F5" }}>
      {/* Header Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 10,
            backgroundColor: "#fff",
            borderRadius: 8,
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
          onPress={() => router.push("/addContact")}
          style={{
            padding: 10,
            backgroundColor: "#4CAF50",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#fff" }}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 12,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>
              {item.name}
            </Text>
            <Text style={{ color: "#888", marginBottom: 10 }}>{item.email}</Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/editContact", params: { id: item.id } })
                }
                style={{
                  padding: 8,
                  backgroundColor: "#2196F3",
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={{
                  padding: 8,
                  backgroundColor: "#FF5252",
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/profile", params: { uid: item.uid } })
                }
                style={{
                  padding: 8,
                  backgroundColor: "#FF9800",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff" }}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
