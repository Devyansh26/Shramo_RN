import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, TextInput } from "react-native";
import { PrimaryButton } from "../components/UI";
import api from "../utils/api";
import { clearUser, getUser } from "../utils/auth";
import { router } from "expo-router";
import { COLORS } from "../utils/theme";

export default function ProfileScreenEmployee() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", location: "" });
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const user = await getUser();
        if (user?.phone) {
          setPhone(user.phone);
          await fetchProfile(user.phone);
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch stored user.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhone();
  }, []);

  const fetchProfile = async (phoneNumber) => {
    try {
      const res = await api.get(`/employers/${phoneNumber}/`);
      setProfile(res.data);
      setForm({ name: res.data.name || "", location: res.data.location || "" });
    } catch (err) {
      Alert.alert("Error", "Could not fetch profile.");
    }
  };

  const updateProfile = async () => {
    if (!form.name || !form.location) {
      return Alert.alert("Missing", "Name and Location are required");
    }
    try {
      const res = await api.put(`/employers/${phone}/`, {
        phone,
        name: form.name,
        location: form.location,
      });
      setProfile(res.data);
      setEditing(false);
      Alert.alert("Success", "Profile updated");
    } catch (err) {
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const logout = async () => {
    await clearUser();
    router.replace("../screens/RoleSelectScreen");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Text style={{ fontSize: 33, fontWeight: "800", marginBottom: 20, color: COLORS.textPrimary }}>
        Profile
      </Text>

      {!editing ? (
        <>
          <Text style={{ fontSize: 16, marginBottom: 8, color: COLORS.textSecondary }}>
            Name: {profile?.name || "Not set"}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 8, color: COLORS.textSecondary }}>
            Phone: {profile?.phone}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 16, color: COLORS.textSecondary }}>
            Location: {profile?.location || "Not set"}
          </Text>

          <PrimaryButton
            title={!profile?.name || !profile?.location ? "Complete Profile" : "Update Profile"}
            onPress={() => setEditing(true)}
            style={{ backgroundColor: COLORS.primary }}
            textStyle={{ color: COLORS.surface }}
          />

          <View style={{ height: 12 }} />
          <PrimaryButton
            title="Logout"
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: logout },
              ])
            }
            style={{ backgroundColor: COLORS.error }}
            textStyle={{ color: COLORS.surface }}
          />
        </>
      ) : (
        <>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.textSecondary,
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              width: "100%",
              backgroundColor: COLORS.surface
            }}
            placeholder="Enter Name"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.textSecondary,
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              width: "100%",
              backgroundColor: COLORS.surface
            }}
            placeholder="Enter Location"
            value={form.location}
            onChangeText={(t) => setForm({ ...form, location: t })}
          />
          <PrimaryButton title="Save" onPress={updateProfile} style={{ backgroundColor: COLORS.primary }} textStyle={{ color: COLORS.surface }} />
          <View style={{ height: 12 }} />
          <PrimaryButton title="Cancel" onPress={() => setEditing(false)} style={{ backgroundColor: COLORS.secondary }} textStyle={{ color: COLORS.surface }} />
        </>
      )}
    </View>
  );
}
