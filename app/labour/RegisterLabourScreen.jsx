import React, { useState } from "react";
import { ScrollView, Text, Alert, View } from "react-native";
import { Input, PrimaryButton, Chip } from "../components/UI";
import { CATEGORIES } from "../utils/constants";
import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";

export default function RegisterLabourScreen() {
//   const { token } = useAuth(); // may be null for new users; backend should allow public registration

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [wage, setWage] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [is_available,setIs_available]=useState(true);

  const submit = async () => {
    if (!name || !phone || !password || !category || !wage)
      return Alert.alert("Missing", "Please fill all required fields");

    try {
      await api.post(
        "/workers/register",
        {
          name,
          phone,
          password, // if backend requires password -- else modify accordingly
          category,
          wage: Number(wage),
          city,
          experience: Number(experience) || 0,
          about,
          is_available,
        }
      );
      Alert.alert("Success", "Registered! You can now log in as Labour.");
    } catch (e) {
      Alert.alert("Demo", "Backend not connected. This is a demo success.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Register as Labour
      </Text>
      <Input label="Name" value={name} onChangeText={setName} placeholder="Full name" />
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="10-digit phone"
        keyboardType="phone-pad"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Text style={{ marginVertical: 8, fontWeight: "600" }}>Category</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
        {CATEGORIES.map((c) => (
          <Chip key={c} text={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>
      <Input
        label="Wage"
        value={wage}
        onChangeText={setWage}
        placeholder="Daily wage"
        keyboardType="numeric"
      />
      <Input label="City" value={city} onChangeText={setCity} placeholder="City" />
      <Input
        label="Experience (years)"
        value={experience}
        onChangeText={setExperience}
        placeholder="Years of experience"
        keyboardType="numeric"
      />
      <Input label="About" value={about} onChangeText={setAbout} placeholder="Short bio" multiline />
      <PrimaryButton title="Register" onPress={submit} />
    </ScrollView>
  );
}
