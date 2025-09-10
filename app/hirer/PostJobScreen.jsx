import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // 👈 add this
import { Input, PrimaryButton, Chip } from "../components/UI";
import { CATEGORIES } from "../utils/constants";
import api from "../utils/api";
import { getUser } from "../utils/auth";
import { router } from "expo-router";

export default function PostJobScreen() {
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
    const [employerPhone, setEmployerPhone] = useState(""); // ✅ dynamic phone



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(); // should return { phone, role, ... }
        if (user?.phone) {
          setEmployerPhone(user.phone);
        }
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);



  const submit = async () => {
    if (!city || categories.length === 0 || !date || !budget) {
      return Alert.alert(
        "Missing",
        "City, Category, Date, and Wage are required"
      );
    }

    try {
      await api.post("/jobs/", {
        employer_phone: employerPhone,
        work_type: categories.join(","),
        location: city,
        work_date: date,
        wage: Number(budget),
        detail:details
      });

      Alert.alert("Success", "Job posted successfully");

      setCity("");
      setCategories([]);
      setBudget("");
      setDetails("");
      setDate("");
      
      router.replace("../HomeTabs")
    } catch (err) {
      console.log("Error posting job:", err.message);
      Alert.alert("Error", "Could not post job. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }} // 👈 ensures scroll space
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
          Post a Job
        </Text>

        <Input
          label="City"
          value={city}
          onChangeText={setCity}
          placeholder="Enter job location"
        />

        <Text style={{ marginVertical: 8, fontWeight: "600" }}>Categories</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
      {CATEGORIES.map((c) => {
        const isSelected = categories.includes(c);
        return (
          <Chip
            key={c}
            text={c}
            selected={isSelected}
            onPress={() => {
              if (isSelected) {
                // remove if already selected
                setCategories(categories.filter((item) => item !== c));
              } else {
                // add if not selected
                setCategories([...categories, c]);
              }
            }}
      />
    );
  })}
</View>


        <Input
          label="Wage (₹)"
          value={budget}
          onChangeText={setBudget}
          placeholder="Enter wage amount"
          keyboardType="numeric"
        />

        {/* 👇 Date Picker instead of typing */}
        <Text style={{ marginVertical: 8, fontWeight: "600" }}>Work Date</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: date ? "#000" : "#888" }}>
            {date || "Select Date"}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setDate(selectedDate.toISOString().split("T")[0]); // YYYY-MM-DD
              }
            }}
          />
        )}

        <Input
          label="Details (optional)"
          value={details}
          onChangeText={setDetails}
          placeholder="Additional details"
          multiline
        />

        <PrimaryButton title="Post Job" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
