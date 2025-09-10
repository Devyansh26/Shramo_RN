import React, { useEffect, useState } from "react";
import { View, FlatList, Text, RefreshControl } from "react-native";
import { Card, EmptyState } from "../components/UI";
import api from "../utils/api";
import { getUser } from "../utils/auth";
import { COLORS } from "../utils/theme";

export default function MyBookingsScreen() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const user = await getUser();
      const res = await api.get(`/jobs/employer_history/?employer_phone=${user.phone}`);
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching employer history:", err.message);
      setItems([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const user = await getUser();
      const res = await api.get(`/jobs/employer_history/?employer_phone=${user.phone}`);
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching employer history:", err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Text style={{ fontSize: 33, fontWeight: "800", paddingBottom: 20, color: COLORS.textPrimary }}>
        My Completed Jobs
      </Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />}
        ListEmptyComponent={<EmptyState title="No completed jobs" subtitle="You have no completed jobs yet." />}
        renderItem={({ item }) => (
          <Card style={{
            backgroundColor: COLORS.surface,
            marginBottom: 12,
            padding: 16,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 6,
            elevation: 4
          }}>
            <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.textPrimary }}>
              {item.work_type || "Job"}
            </Text>
            <Text style={{ color: COLORS.textSecondary }}>Date: {item.work_date}</Text>
            <Text style={{ color: COLORS.textSecondary }}>Status: {item.status}</Text>
            <Text style={{ color: COLORS.textSecondary }}>Location: {item.location}</Text>
            <Text style={{ color: COLORS.textSecondary }}>Wage: ₹{item.wage}</Text>
            <Text style={{ color: COLORS.textSecondary }}>Details: {item.detail}</Text>
          </Card>
        )}
      />
    </View>
  );
}
