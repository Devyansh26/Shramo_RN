import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Card, EmptyState } from "../components/UI";
import api from "../utils/api";
import { getUser } from "../utils/auth";  // ✅ import your helper


export default function CompletedEnquiry() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workerPhone, setWorkerPhone] = useState(null);

  const fetchHistory = async (phone) => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await api.get(`/bookings/worker_bookings/?worker_phone=${phone}`);
      // ✅ filter only completed bookings
      const completedBookings = res.data.filter(b => b.status === "completed" || b.status === "declined") || [];
      setHistory(completedBookings);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user?.phone) {
        setWorkerPhone(user.phone);
        fetchHistory(user.phone);
      }
    };
    loadUser();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16,marginTop:40 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", paddingBottom: 20 }}>
        Booking History
      </Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <EmptyState
              title="No History"
              subtitle="You have no completed bookings yet."
            />
          }
          renderItem={({ item }) => (
            <Card>
              <Text style={{ fontWeight: "700" }}>{item.category}</Text>
              <Text>From: {item.employer.name}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Status: Completed</Text>
              <Text>
                Completed At:{" "}
                {new Date(item.updated_at).toLocaleDateString()}
              </Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}
