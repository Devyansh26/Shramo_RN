import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Card, OutlineButton } from "../components/UI";
import api from "../utils/api";
import { getUser, clearUser } from "../utils/auth"; 
import { router } from "expo-router";
import { COLORS } from "../utils/theme";

export default function ProfileScreen() {
  const [worker, setWorker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    skills: "",
    is_available: true,
  });
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState(null);

  // fetch worker profile
  const fetchProfile = async (phoneNum) => {
    try {
      const res = await api.get(`/workers/${phoneNum}/`);
      setWorker(res.data);
      setForm({
        name: res.data.name,
        location: res.data.location,
        skills: res.data.skills,
        is_available: res.data.is_available,
      });
    } catch (e) {
      console.log("Profile fetch error:", e.response?.data || e.message);
      // fallback demo
      setWorker({
        phone: phoneNum,
        name: "Demo User",
        location: "Delhi",
        skills: "cleaning,plumbing",
        is_available: true,
        rating: 4.5,
      });
      setForm({
        name: "Demo User",
        location: "Delhi",
        skills: "cleaning,plumbing",
        is_available: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const user = await getUser();
      if (user && user.phone) {
        setPhone(user.phone);
        fetchProfile(user.phone);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const updateProfile = async () => {
    try {
      const res = await api.put(`/workers/${phone}/`, {
        phone: phone, // required since phone is PK
        ...form,
      });
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
      setWorker(res.data); // refresh with new data
    } catch (e) {
      console.log("Update error:", e.response?.data || e.message);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const logout = async () => {
    await clearUser(); // clears AsyncStorage (role + phone)
    router.replace("../screens/RoleSelectScreen");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!worker) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No user found. Please log in again.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 20, color: "#111827" }}>
        Profile
      </Text>

      <Card>
        <Text style={{ fontWeight: "700", marginBottom: 10 }}>
          Phone: {worker.phone}
        </Text>

        <Text>Name</Text>
        {isEditing ? (
          <TextInput
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
          />
        ) : (
          <Text style={{ marginBottom: 10 }}>{worker.name}</Text>
        )}

        <Text>Location</Text>
        {isEditing ? (
          <TextInput
            value={form.location}
            onChangeText={(t) => setForm({ ...form, location: t })}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
          />
        ) : (
          <Text style={{ marginBottom: 10 }}>{worker.location}</Text>
        )}

        <Text>Skills</Text>
        {isEditing ? (
          <TextInput
            value={form.skills}
            onChangeText={(t) => setForm({ ...form, skills: t })}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
          />
        ) : (
          <Text style={{ marginBottom: 10 }}>{worker.skills}</Text>
        )}

        <Text>Available</Text>
        <Text style={{ marginBottom: 10 }}>
          {worker.is_available ? "Yes" : "No"}
        </Text>

        <Text>Rating</Text>
        <Text style={{ marginBottom: 20 }}>{worker.rating}</Text>

        {isEditing ? (
          <OutlineButton title="Save" onPress={updateProfile} />
        ) : (
          <OutlineButton title="Edit Profile" onPress={() => setIsEditing(true)} />
        )}
      </Card>

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: logout },
          ])
        }
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: COLORS.error,
          borderRadius: 8,
          color: COLORS.surface 
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
