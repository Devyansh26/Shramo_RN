import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, PrimaryButton } from "../components/UI";
import api from "../utils/api";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [dailyWages, setDailyWages] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    if (!name || !phone || !location || !skills || !dailyWages) {
      return Alert.alert("Missing", "Fill all fields");
    }
    try {
      await api.post("/workers/", {
        name,
        phone,
        location,
        skills,
        daily_wages: dailyWages,
        is_available: true,
        // is_mobile_user: true, // ✅ mark app-registered worker
      });
      Alert.alert(
        "Success",
        "Registered successfully! Please login.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/labour/LoginScreen"),
          },
        ]
      );
    } catch (e) {
      console.log("Error registering worker:", e.response?.data || e.message);
      const info=e.response?.data || e.message;
      Alert.alert("Register failed", `Could not register worker.\n${info.phone}` );
    }
    
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 16 }}>
        Labour Registration
      </Text>
      <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
      <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="10-digit phone" keyboardType="phone-pad" />
      <Input label="Location" value={location} onChangeText={setLocation} placeholder="City/Area" />
      <Input label="Skills" value={skills} onChangeText={setSkills} placeholder="e.g. Masonry, Painting" />
      <Input label="Daily Wages" value={dailyWages} onChangeText={setDailyWages} placeholder="e.g. 500" keyboardType="numeric" />
      <PrimaryButton title="Sign up" onPress={onSubmit} />
    </View>
  );
}
