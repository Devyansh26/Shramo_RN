import AsyncStorage from "@react-native-async-storage/async-storage";

export const setUser = async (phone, role) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify({ phone, role }));
  } catch (e) {
    console.log("Error saving user:", e);
  }
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("Error getting user:", e);
    return null;
  }
};

export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (e) {
    console.log("Error clearing user:", e);
  }
};
