import React from "react";
import { View, Text } from "react-native";
import { PrimaryButton, OutlineButton } from "../components/UI";
import { useRouter } from "expo-router";


export default function RoleSelectScreen() {
    const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 8 }}>
        Welcome 👋
      </Text>
      <Text style={{ color: "#475569", marginBottom: 24 }}>
        Hire skilled labour or register as a worker to get jobs near you.
      </Text>
      <PrimaryButton
        title="I want to Hire"
        onPress={() => router.push("hirer/LoginScreen")}
      />
      <View style={{ height: 12 }} />
      <OutlineButton
        title="I am a Labour"
        onPress={() => router.push("labour/LoginScreen")}
      />
      <View style={{ height: 12 }} />
      <OutlineButton
        title="Register as Labour (new)"
        onPress={() => router.push("labour/RegisterScreen")}
      />
    </View>
  );
}
