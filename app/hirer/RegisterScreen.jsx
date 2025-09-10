import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, PrimaryButton } from "../components/UI";
import api from "../utils/api";
import { useRouter } from "expo-router";
import { setUser } from "../utils/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    if (!name || !location || !phone)
      return Alert.alert("Missing", "Fill all fields");
    try {
      await api.post("/employers/", { name, location, phone });
      await setUser(phone, "employer");
      router.replace("/hirer/LoginScreen");
    } catch (e) {
      Alert.alert("Register failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 16 }}>
        Hirer Registration
      </Text>
      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />
      <Input
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="City/Area"
      />
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="10-digit phone"
        keyboardType="phone-pad"
      />
      <PrimaryButton title="Sign up" onPress={onSubmit} />
    </View>
  );
}
