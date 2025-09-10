import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, PrimaryButton, OutlineButton } from "../components/UI";
import api from "../utils/api";
import { router } from "expo-router";
import { setUser } from "../utils/auth";

// Random OTP generator

// const generateOtp = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

export default function WorkerLoginScreen() {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // const onSubmit = async () => {
  //   if (!phone) return Alert.alert("Missing", "Enter phone number");
  //   try {
  //     setSubmitting(true);
  //     const res = await api.get(`/workers/${phone}/`); // ✅ check worker
  //     if (res.data) {
  //       // ✅ Generate OTP
  //       const otp = generateOtp();

  //       // ✅ Send via Fast2SMS
  //       const url = `https://www.fast2sms.com/dev/whatsapp?authorization={WhatsappApiKey}&message_id=5092&numbers=${phone}&variables_values=${otp}`;
  //       await fetch(url);

  //       Alert.alert("OTP Sent", "Check your WhatsApp for the code.");

  //       // ✅ Go to OTP screen with params
  //       router.push({
  //         pathname: "/labour/OtpScreen",
  //         params: { phone, otp, role: "worker" },
  //       });
  //     } else {
  //       Alert.alert("Not found", "No worker with this phone. Please register.");
  //       router.replace("../screens/RoleSelectScreen");
  //     }
  //   } catch (e) {
  //     Alert.alert("Error", "Something went wrong. Try again.");
  //     router.replace("../screens/RoleSelectScreen");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  const onSubmitDev = async () => {
    if (!phone) return Alert.alert("Missing", "Enter phone number");
    try {
      setSubmitting(true);
      const res = await api.get(`/workers/${phone}/`); // ✅ check worker
      if (res.data) {
        const  role="worker";
        await setUser(phone, role);
        Alert.alert("Login Successful", "Redirecting to home...");
        
        // ✅ Directly go to home/tabs without OTP verification
        router.replace("../HomeTabs"); // Adjust this path according to your routing structure
      } else {
        Alert.alert("Not found", "No worker with this phone. Please register.");
        router.replace("../screens/RoleSelectScreen");
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong. Try again.");
      router.replace("../screens/RoleSelectScreen");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 16 }}>
        Worker Login
      </Text>
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="10-digit phone"
        keyboardType="phone-pad"
      />
      <PrimaryButton
        title={submitting ? "Please wait…" : "Login"}
        onPress={onSubmitDev}
        disabled={submitting}
      />
      <View style={{ height: 12 }} />
      <OutlineButton
        title="Register as Labour"
        onPress={() => router.push("labour/RegisterScreen")}
      />
    </View>
  );
}
