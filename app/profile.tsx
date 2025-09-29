import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Profile() {
  const router = useRouter();
  const params = useLocalSearchParams(); // fixed hook
  const contactUid = params.uid as string | undefined; // optional uid of contact

  const [email, setEmail] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [canView, setCanView] = useState(true);

  const userId = contactUid || auth.currentUser?.uid;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId || !auth.currentUser) return;

      // Only allow viewing if it's your profile or you're in their contacts
      if (userId !== auth.currentUser.uid) {
        const snapshot = await getDocs(collection(db, `users/${userId}/contacts`));
        const contactEmails = snapshot.docs.map((doc) => doc.data().email);
        if (!contactEmails.includes(auth.currentUser.email || "")) {
          Alert.alert("Access Denied", "You are not allowed to view this profile.");
          router.back();
          setCanView(false);
          return;
        }
      }

      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setEmail(data.email || "");
        setMedicalInfo(data.medicalInfo || "");
        setAllergies(data.allergies || "");
      }
    };

    loadProfile();
  }, [userId]);

  if (!canView) return null;

  const handleSave = async () => {
    if (!userId) return;
    try {
      await setDoc(
        doc(db, "users", userId),
        { medicalInfo, allergies, email },
        { merge: true }
      );
      Alert.alert("Success", "Profile updated!");
      setIsEditing(false);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#F5F5F5" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        {userId === auth.currentUser?.uid ? "My Profile" : "Contact Profile"}
      </Text>

      <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Email</Text>
      <Text style={{ marginBottom: 15 }}>{email}</Text>

      <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Medical Info</Text>
      {isEditing ? (
        <TextInput
          value={medicalInfo}
          onChangeText={setMedicalInfo}
          placeholder="Enter your medical info"
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        />
      ) : (
        <Text style={{ marginBottom: 15 }}>{medicalInfo || "Not set"}</Text>
      )}

      <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Allergies</Text>
      {isEditing ? (
        <TextInput
          value={allergies}
          onChangeText={setAllergies}
          placeholder="Enter your allergies"
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
            backgroundColor: "#fff",
          }}
        />
      ) : (
        <Text style={{ marginBottom: 20 }}>{allergies || "Not set"}</Text>
      )}

      {userId === auth.currentUser?.uid && (
        isEditing ? (
          <Button title="Save Profile" onPress={handleSave} />
        ) : (
          <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
        )
      )}

      <View style={{ height: 10 }} />
      <Button title="Back" onPress={() => router.back()} color="#888" />
    </ScrollView>
  );
}
