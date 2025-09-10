import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Linking, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { PrimaryButton, OutlineButton } from "../components/UI";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "../utils/api";
import { getUser } from "../utils/auth";   // ✅ import getUser

export default function LabourDetailScreen() {
  const { labour } = useLocalSearchParams();
  const item = JSON.parse(labour);
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [employerPhone, setEmployerPhone] = useState(null); // ✅ store employer phone

  const fetchBooking = async (phone) => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await api.get(`/bookings/my_bookings/?employer_phone=${phone}`);
      const bookings = res.data || [];
      const matchingBooking = bookings.find(
        (b) => b.worker_phone === item.phone && b.status !== "completed" && b.status !== "declined"
      );
      setBooking(matchingBooking || null);
    } catch (error) {
      console.error(error);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!employerPhone) return;
    setRefreshing(true);
    try {
      const res = await api.get(`/bookings/my_bookings/?employer_phone=${employerPhone}`);
      const bookings = res.data || [];
      const matchingBooking = bookings.find(
        (b) => b.worker_phone === item.phone && b.status !== "completed" && b.status !== "declined"
      );
      setBooking(matchingBooking || null);
    } catch (error) {
      console.error(error);
      setBooking(null);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const user = await getUser();
        if (user?.phone && user?.role === "employer") {
          setEmployerPhone(user.phone);     // ✅ set employer phone from storage
          fetchBooking(user.phone);         // ✅ pass it to API call
        }
      };
      loadUser();
    }, [item.phone])
  );

  useEffect(() => {
    let intervalId;
    if (booking?.status === "pending" && employerPhone) {
      intervalId = setInterval(() => {
        fetchBooking(employerPhone);
      }, 10000); // Poll every 10 seconds when pending
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [booking?.status, employerPhone]);

  const handleCall = () => {
    Linking.openURL(`tel:${item.phone}`);
  };

  const handleBookNow = () => {
    router.push({
      pathname: "/hirer/BookLabourScreen",
      params: { worker: JSON.stringify(item) },
    });
  };

  const handleComplete = async () => {
    if (!booking) return;
    setCompleting(true);
    try {
      await api.post(`/bookings/${booking.id}/complete/`, { role: "employer" });
      await fetchBooking(employerPhone); // ✅ use dynamic employerPhone
      if (booking.status === "accepted") {
        router.replace("../HomeTabs");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCompleting(false);
    }
  };

  const renderBookingStatus = () => {
    if (loading) {
      return <ActivityIndicator />;
    }
    if (!booking) {
      return <PrimaryButton title="Book Now" onPress={handleBookNow} />;
    }
    switch (booking.status) {
      case "pending":
        return <Text>Waiting for confirmation</Text>;
      case "accepted":
        return (
          <>
            <Text>Accepted</Text>
            <PrimaryButton
              title={completing ? "Completing..." : "Complete Job"}
              onPress={handleComplete}
              disabled={completing}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#9Bd35A", "#689F38"]}
          tintColor="#689F38"
        />
      }
    >
      <View style={{ flex: 1, padding: 16, marginTop: 100 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{item.name}</Text>
        <Text>Category: {item.skills}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Rating: {item.rating ?? "N/A"}</Text>
        <Text>Phone: {item.phone}</Text>

        <View style={{ marginTop: 20 }}>
          <OutlineButton title="Call" onPress={handleCall} />
          {renderBookingStatus()}
        </View>
      </View>
    </ScrollView>
  );
}