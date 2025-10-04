/**
 * signup.tsx
 * 
 * This file contains the Signup component for user registration.
 * It includes input fields for email and password, and a signup button that creates a new user
 * account using Firebase Auth. Upon success, it alerts the user and navigates to the login screen.
 */

import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      // Create account in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Create Firestore document for the user
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,   // store uid for reference
        email: userCred.user.email,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created!");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Signup failed", error.message);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Back to Login" onPress={() => router.push("/login")} />
    </View>
  );
}
