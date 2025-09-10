import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { Card, EmptyState } from "../components/UI";
import api from "../utils/api";
import { getUser } from "../utils/auth"; // fetch worker info

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const user = await getUser(); // get worker phone
      const res = await api.get(`/jobs/worker_history/?worker_phone=${user.phone}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching worker history:", err.message);
      setHistory([
        { id: "h1", title: "Painting Work", date: "2025-08-20", wage: 400, employer: "Sunil" },
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const user = await getUser(); // get worker phone
      const res = await api.get(`/jobs/worker_history/?worker_phone=${user.phone}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching worker history:", err.message);
      setHistory([
        { id: "h1", title: "Painting Work", date: "2025-08-20", wage: 400, employer: "Sunil" },
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", paddingBottom: 20 }}>Work History</Text>

      <FlatList
        data={history}
        keyExtractor={(i) => i.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']} // Android
            tintColor="#689F38" // iOS
          />
        }
        ListEmptyComponent={<EmptyState title="No History" subtitle="You have no completed jobs." />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: "700" }}>{item.work_type}</Text>
            <Text>Date: {item.work_date}</Text>
            <Text>Employer: {item.employer_phone}</Text>
            <Text>Wage: ₹{item.wage}</Text>
          </Card>
        )}
      />
    </View>
  );
}