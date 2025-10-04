import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

const PersonalThreatIcon = require('../assets/images/personal-threat.png');
const MedicalEmergencyIcon = require('../assets/images/medical-emergency.png');
const DisasterIcon = require('../assets/images/disaster.png');
const AccidentIcon = require('../assets/images/accident.png');
const VulnerablePersonIcon = require('../assets/images/vulnerable-person.png');

const EMERGENCY_CATEGORIES = [
  {
    key: 'personal',
    label: 'Personal Threat',
    color: '#E53935',
    icon: PersonalThreatIcon,
  },
  {
    key: 'medical',
    label: 'Medical Emergency',
    color: '#1E88E5',
    icon: MedicalEmergencyIcon,
  },
  {
    key: 'disaster',
    label: 'Disaster / Environmental',
    color: '#FB8C00',
    icon: DisasterIcon,
  },
  {
    key: 'accident',
    label: 'Accident',
    color: '#FDD835',
    icon: AccidentIcon,
  },
  {
    key: 'vulnerable',
    label: 'Vulnerable Person',
    color: '#8E24AA',
    icon: VulnerablePersonIcon,
  },
];

export default function SOSScreen() {
  const [note, setNote] = useState('');
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, []);

  const handleSOS = async (category) => {
    if (!auth.currentUser) return;

    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to send SOS.');
      return;
    }

    // Get current location
    let location = await Location.getCurrentPositionAsync({});

    // Get timestamp
    const timestamp = new Date().toISOString();

    // Fetch contacts
    const snapshot = await getDocs(
      collection(db, "users/" + auth.currentUser.uid + "/contacts")
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

    // Prepare SOS payload including profile info
    const sosPayload = {
      category: category.label,
      timestamp,
      location: location.coords,
      note,
      profile: profile ? {
        name: profile.name || '',
        bloodType: profile.bloodType || '',
        allergies: profile.allergies || '',
        medicalInfo: profile.medicalInfo || '',
        email: profile.email || '',
      } : {},
      contacts: latestContacts,
    };

    // TODO: Send sosPayload to backend or SOS handler here

    // Mobile alert
    Alert.alert(
      'SOS Sent',
      `Category: ${category.label}\nTime: ${timestamp}\nNote: ${note}`
    );
    setNote('');
    router.push('/dashboard'); // Replace with your actual dashboard route

    // Web alert fallback
    if (typeof window !== "undefined") {
      window.alert(`SOS Sent! Category: ${category.label}\nTime: ${timestamp}\nNote: ${note}`);
    }

    console.log("📢 SOS Payload:", sosPayload);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Quick SOS</Text>
      <View style={styles.buttonContainer}>
        {EMERGENCY_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.button, { backgroundColor: cat.color }]}
            onPress={() => handleSOS(cat)}
            accessibilityLabel={cat.label}
          >
            <Image source={cat.icon} style={styles.icon} />
            <Text style={styles.label}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Optional note (e.g. 'I'm bleeding')"
        value={note}
        onChangeText={setNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  buttonContainer: { flexDirection: 'column', gap: 16 },
  button: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 12, marginBottom: 12 },
  icon: { width: 32, height: 32, marginRight: 16 },
  label: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  input: { marginTop: 24, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
});
