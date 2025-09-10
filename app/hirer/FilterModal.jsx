import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input, PrimaryButton } from "../components/UI";

export default function FilterModal({ route, navigation }) {
  const [city, setCity] = useState("");
  const [minWage, setMinWage] = useState("");
  const [maxWage, setMaxWage] = useState("");
  const [experience, setExperience] = useState("");

  const apply = () => {
    // Pass filter params back or store globally as needed
    navigation.goBack();
    route?.params?.onApply?.();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 24, marginBottom: 16 }}>Filters</Text>
      <Input label="City" value={city} onChangeText={setCity} placeholder="City" />
      <Input label="Min Wage" value={minWage} onChangeText={setMinWage} placeholder="Minimum wage" keyboardType="numeric" />
      <Input label="Max Wage" value={maxWage} onChangeText={setMaxWage} placeholder="Maximum wage" keyboardType="numeric" />
      <Input label="Experience (years)" value={experience} onChangeText={setExperience} placeholder="Experience in years" keyboardType="numeric" />
      <PrimaryButton title="Apply" onPress={apply} />
    </View>
  );
}
