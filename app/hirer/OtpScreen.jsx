import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, PrimaryButton } from "../components/UI";
import { useLocalSearchParams, useRouter } from "expo-router";
import { setUser } from "../utils/auth";

export default function OtpScreen() {
  const { phone, otp, role } = useLocalSearchParams(); // ✅ params from login
  const [enteredOtp, setEnteredOtp] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    if (enteredOtp === otp) {
      // ✅ Save user in AsyncStorage
      await setUser(phone, role);

      Alert.alert("Success", "OTP Verified!");
      router.replace("../HomeTabs"); // redirect to HomeTabs
    } else {
      Alert.alert("Error", "Invalid OTP. Try again.");
    }
  };


  return (
    <View style={{ flex: 1, padding: 20 ,marginTop:100}}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 16 }}>
        Enter OTP
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 12, color: "#555" }}>
        Phone: {phone}
      </Text>  
      <Input
        label="OTP"
        value={enteredOtp}
        onChangeText={setEnteredOtp}
        placeholder="Enter OTP"
        keyboardType="numeric"
        
      />
      <PrimaryButton title="Verify" onPress={onSubmit} />
    </View>
  );
  
}
