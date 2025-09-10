import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Input, PrimaryButton } from "../components/UI";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../utils/api";
import { getUser } from "../utils/auth";   // ✅ import getUser

export default function BookLabourScreen() {
  const { worker } = useLocalSearchParams();
  const item = JSON.parse(worker);
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(item.location || "");
  const [category, setCategory] = useState(item.work_category || "");
  const [loading, setLoading] = useState(false);
  const [employerPhone, setEmployerPhone] = useState(null); // ✅ dynamic employer phone

  // ✅ Load employer phone from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user?.phone) {
        setEmployerPhone(user.phone);
      }
    };
    loadUser();
  }, []);

  const handlePostBooking = async () => {
    if (!employerPhone) {
      alert("Employer phone not found. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const data = {
        employer_phone: employerPhone,  // ✅ use fetched phone
        worker_phone: item.phone,
        description,
        location,
        category,
      };
      await api.post("/bookings/", data);
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, marginTop: 100 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Book {item.name}
      </Text>

      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the job..."
        multiline
      />
      <Input
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Job location"
      />
      <Input
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Job category"
      />

      <PrimaryButton onPress={handlePostBooking} disabled={loading || !employerPhone}>
        {loading ? "Posting..." : "Post Booking"}
      </PrimaryButton>
    </View>
  );
}
