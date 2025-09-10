import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, PrimaryButton, OutlineButton } from "../components/UI";
import api from "../utils/api";
import { router } from "expo-router";
import { setUser } from "../utils/auth";

// Random 6-digit generator
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // const onSubmit = async () => {
  //   if (!phone) return Alert.alert("Missing", "Enter phone number");
  //   try {
  //     setSubmitting(true);
  //     const res = await api.get(`/employers/${phone}/`); // check if user exists
  //     if (res.data) {
  //       // ✅ Generate OTP
  //       const otp = generateOtp();

  //       // ✅ Send via Fast2SMS WhatsApp API
  //       const url = `https://www.fast2sms.com/dev/whatsapp?authorization={WhatsappApiKey}&message_id=5092&numbers=${phone}&variables_values=${otp}`;
  //       await fetch(url);

  //       Alert.alert("OTP Sent", "Check your WhatsApp for the code.");

  //       // ✅ Navigate to OTP screen with phone, otp, role
  //       router.push({
  //         pathname: "/hirer/OtpScreen",
  //         params: { phone, otp, role: "employer" },
  //       });
  //     } else {
  //       Alert.alert("Not found", "No employer with this phone. Please register.");
  //     }
  //   } catch (e) {
  //     Alert.alert("Not found", "No employer with this phone. Please register first.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  // Development mode onSubmit function for Hirer - skips OTP verification
  const onSubmitDev = async () => {
    if (!phone) return Alert.alert("Missing", "Enter phone number");
    try {
      setSubmitting(true);
      const res = await api.get(`/employers/${phone}/`); // check if user exists
      if (res.data) { 
        const  role="employer";
        await setUser(phone, role);
        Alert.alert("Login Successful", "Redirecting to home...");
        
        // ✅ Directly go to hirer home/tabs without OTP verification
        router.replace("../HomeTabs"); // Adjust this path according to your routing structure
      } else {
        Alert.alert("Not found", "No employer with this phone. Please register.");
      }
    } catch (e) {
      Alert.alert("Not found", "No employer with this phone. Please register first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 16 }}>
        Hirer Login
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
        title="Create account"
        onPress={() => router.push("hirer/RegisterScreen")}
      />
    </View>
  );
}
