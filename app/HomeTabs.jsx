import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BrowseScreen from "./hirer/BrowseScreen";
import PostJobScreen from "./hirer/PostJobScreen";
import MyBookingsScreen from "./hirer/MyBookingsScreen";
import ProfileScreenEmployee from "./hirer/ProfileScreenEmployee";
import EmployerJobsScreen from "./hirer/EmployerJobsScreen";

import EnquiriesScreen from "./labour/EnquiriesScreen";
import NearbyJobsScreen from "./labour/NearbyJobsScreen";
import ProfileScreenLabour from "./labour/ProfileScreenLabour";
import HistoryScreen from "./labour/HistoryScreen";
import { getUser } from "./utils/auth";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  const [role, setRole] = useState("hirer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await getUser();
        if (user?.role) {
          setRole(user.role);
        } else {
          setRole("hirer");
        }
      } catch (error) {
        console.log("Error fetching role:", error);
        setRole("hirer");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: "#2D9CDB",
    tabBarInactiveTintColor: "#828282",
    tabBarStyle: {
      backgroundColor: "#FFFFFF",
      borderTopColor: "#E0E0E0",
      height: 60,
      paddingBottom: 6,
    },
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === "Browse") iconName = "search";
      else if (route.name === "Post Job") iconName = "briefcase";
      else if (route.name === "Bookings") iconName = "list";
      else if (route.name === "Profile") iconName = "person";
      else if (route.name === "Enquiries") iconName = "chatbubble";
      else if (route.name === "Nearby Jobs") iconName = "navigate";
      else if (route.name === "History") iconName = "time";
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  });

  if (role === "worker") {
    return (
      <SafeAreaView style={styles.container}>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Enquiries" component={EnquiriesScreen} />
          <Tab.Screen name="Nearby Jobs" component={NearbyJobsScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Profile" component={ProfileScreenLabour} />
        </Tab.Navigator>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Browse" component={BrowseScreen} />
        <Tab.Screen name="Post Job" component={EmployerJobsScreen} />
        <Tab.Screen name="Bookings" component={MyBookingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreenEmployee} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40, // adjust if needed
  },
});
