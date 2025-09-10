import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { COLORS } from "../utils/theme";

export const PrimaryButton = ({ title, onPress, disabled, style, textStyle }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.btn,
      { backgroundColor: COLORS.primary },
      style,
      disabled && { opacity: 0.6 },
    ]}
  >
    <Text style={[styles.btnText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export const OutlineButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.btnOutline, { borderColor: COLORS.primary }, style]}
  >
    <Text style={[styles.btnOutlineText, { color: COLORS.primary }, textStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
}) => (
  <View style={{ marginBottom: 12 }}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      style={[
        styles.input,
        multiline && { height: 100, textAlignVertical: "top" },
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
    />
  </View>
);

export const Card = ({ children, onPress, style }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    style={[styles.card, style]}
  >
    {children}
  </TouchableOpacity>
);

export const Chip = ({ text, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      selected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    ]}
  >
    <Text style={[styles.chipText, selected && { color: "#fff" }]}>{text}</Text>
  </TouchableOpacity>
);

export const EmptyState = ({
  title = "No data",
  subtitle = "Try adjusting filters or come back later.",
}) => (
  <View style={{ alignItems: "center", padding: 24 }}>
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6, color: COLORS.textPrimary }}>
      {title}
    </Text>
    <Text style={{ color: COLORS.textSecondary, textAlign: "center" }}>
      {subtitle}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  btn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnOutlineText: { fontWeight: "700" },
  label: { marginBottom: 6, color: COLORS.textPrimary, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
  },
  card: {
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 14,
  marginVertical: 8,
  borderWidth: 1,
  borderColor: "#f1f5f9",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
},

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { color: COLORS.textPrimary },
});

// Default export for Expo Router
export default {
  PrimaryButton,
  OutlineButton,
  Input,
  Card,
  Chip,
  EmptyState,
};
