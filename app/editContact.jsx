/**
 * editContact.tsx
 * 
 * This file contains the EditContact component which allows users to edit an existing contact.
 * It retrieves the contact ID from the URL parameters, loads the contact data from Firestore,
 * and provides a form to update the contact's name.
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function EditContact() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // removed type annotation
  const [name, setName] = useState("");

  useEffect(() => {
    const loadContact = async () => {
      if (!auth.currentUser || !id) return;
      const ref = doc(db, "users/" + auth.currentUser.uid + "/contacts/" + id);
      const snap = await getDoc(ref);
      if (snap.exists()) setName(snap.data().name);
    };
    loadContact();
  }, [id]);

  const handleUpdate = async () => {
    if (!auth.currentUser || !id) return;
    try {
      const ref = doc(db, "users/" + auth.currentUser.uid + "/contacts/" + id);
      await updateDoc(ref, { name });
      Alert.alert("Updated", "Contact updated!");
      router.back();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Edit Contact</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
}
