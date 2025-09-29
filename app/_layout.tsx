/**
 * _layout.tsx
 * 
 * This file defines the main layout and navigation stack for the app.
 * It uses Expo Router's Stack component to define the screens and their order.
 * The header is hidden for all screens.
 */

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="contacts" />
      <Stack.Screen name="addContact" />
      <Stack.Screen name="editContact" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
