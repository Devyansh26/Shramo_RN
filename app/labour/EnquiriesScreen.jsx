import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Card, EmptyState, PrimaryButton } from "../components/UI";
import api from "../utils/api";
import { useRouter } from "expo-router";
import { getUser } from "../utils/auth";

export default function EnquiriesScreen() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [workerPhone, setWorkerPhone] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user && user.role === "worker") {
        setWorkerPhone(user.phone);
      }
    };
    fetchUser();
  }, []);

  const fetchData = async () => {
    if (!workerPhone) return;
    setLoading(true);
    try {
      const res = await api.get(`/bookings/worker_bookings/?worker_phone=${workerPhone}`);
      const activeEnquiries = res.data.filter(b => b.status !== "completed") || [];
      setEnquiries(activeEnquiries);
    } catch (error) {
      console.error(error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!workerPhone) return;
    setRefreshing(true);
    try {
      const res = await api.get(`/bookings/worker_bookings/?worker_phone=${workerPhone}`);
      const activeEnquiries = res.data.filter(b => b.status !== "completed" && b.status !== "declined") || [];
      setEnquiries(activeEnquiries);
    } catch (error) {
      console.error(error);
      setEnquiries([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (workerPhone) {
      fetchData();
    }
  }, [workerPhone]);

  const respond = async (id, response) => {
    try {
      await api.post(`/bookings/${id}/respond/`, { role: "worker", response });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(`Error: Failed to ${response ? "accept" : "decline"} booking`);
    }
  };

  const markComplete = async (id) => {
    try {
      await api.post(`/bookings/${id}/complete/`, { role: "worker" });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Error: Failed to mark as complete");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "800", paddingBottom: 20, color: "#333333" }}>
          Enquiries
        </Text>
        <TouchableOpacity onPress={() => router.push("/labour/CompletedEnquiry")}>
          <Text style={{ fontSize: 16, color: "#2D9CDB", fontWeight: "600" }}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={{ color: "#828282" }}>Loading...</Text>
      ) : (
        <FlatList
          data={enquiries}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2D9CDB", "#F2994A"]}
              tintColor="#2D9CDB"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Enquiries"
              subtitle="No one has contacted you yet."
            />
          }
          renderItem={({ item }) => (
            <Card style={{ backgroundColor: "#FFFFFF", padding: 12, marginVertical: 8, borderRadius: 12 }}>
              <Text style={{ fontWeight: "700", color: "#333333" }}>{item.category}</Text>
              <Text style={{ color: "#828282" }}>From: {item.employer.name}</Text>
              <Text style={{ color: "#828282" }}>Location: {item.location}</Text>
              <Text style={{ color: "#828282" }}>Description: {item.description}</Text>
              <Text style={{ color: "#2D9CDB" }}>Status: {item.status}</Text>
              {item.status === "pending" && (
                <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                  <PrimaryButton title="Accept" onPress={() => respond(item.id, true)} />
                  <PrimaryButton title="Decline" onPress={() => respond(item.id, false)} />
                </View>
              )}
              {item.status === "accepted" && (
                <View style={{ marginTop: 10 }}>
                  <PrimaryButton title="Mark as Complete" onPress={() => markComplete(item.id)} />
                </View>
              )}
            </Card>
          )}
        />
      )}
    </View>
  );
}
