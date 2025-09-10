import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Card, EmptyState, PrimaryButton } from "../components/UI";
import api from "../utils/api";
import { getUser } from "../utils/auth";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../utils/theme";

export default function EmployerJobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const user = await getUser();
      if (!user?.phone) {
        Alert.alert("Error", "Employer phone not found");
        return;
      }
      const res = await api.get(`/jobs/my_jobs/?employer_phone=${user.phone}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const user = await getUser();
      const res = await api.get(`/jobs/my_jobs/?employer_phone=${user.phone}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchJobs(); }, []));

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Text style={{ fontSize: 33, fontWeight: "800", marginBottom: 20, color: COLORS.textPrimary }}>
        My Jobs
      </Text>

      <PrimaryButton
        title="Post New Job"
        onPress={() => router.push("/hirer/PostJobScreen")}
        style={{ backgroundColor: COLORS.primary }}
        textStyle={{ color: COLORS.surface }}
      />

      <FlatList
        data={jobs}
        keyExtractor={(i) => i.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Jobs Posted"
            subtitle="You have not posted any jobs yet."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/hirer/JobDetailScreen/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <Card style={{
              backgroundColor: COLORS.surface,
              marginBottom: 12,
              padding: 16,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 6,
              elevation: 4
            }}>
              <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.textPrimary }}>
                {item.work_type}
              </Text>
              <Text style={{ color: COLORS.textSecondary }}>Date: {item.work_date}</Text>
              <Text style={{ color: COLORS.textSecondary }}>Location: {item.location}</Text>
              <Text style={{ color: COLORS.textSecondary }}>Wage: ₹{item.wage}</Text>
              <Text style={{ color: COLORS.textSecondary }}>Status: {item.status}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
