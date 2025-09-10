import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { Card, Input, EmptyState } from "../components/UI";
import api from "../utils/api";
import { useRouter } from "expo-router";

export default function BrowseScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/workers/`);
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.get(`/workers/`);
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
      <Text style={{ fontSize: 33, fontWeight: "800", paddingBottom: 16, color: "#333333" }}>
        Dashboard
      </Text>

      <Input
        label="Search"
        value={query}
        onChangeText={setQuery}
        placeholder="Search labour"
        style={{ marginBottom: 12 }}
      />

      {loading ? (
        <Text style={{ color: "#828282" }}>Loading…</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.phone}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2D9CDB", "#F2994A"]}
              tintColor="#2D9CDB"
            />
          }
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item }) => (
            <Card
              style={{ backgroundColor: "#FFFFFF", padding: 12, marginVertical: 8, borderRadius: 12 }}
              onPress={() =>
                router.push({
                  pathname: "/hirer/LabourDetailScreen",
                  params: { labour: JSON.stringify(item) },
                })
              }
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#333333" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#828282" }}>
                {item.work_category} • ⭐ {item.rating ?? "—"}
              </Text>
              <Text style={{ color: "#2D9CDB" }}>{item.location}</Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}
