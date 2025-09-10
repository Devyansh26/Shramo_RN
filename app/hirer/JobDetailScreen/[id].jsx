import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Linking,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Card,
  EmptyState,
  PrimaryButton,
  OutlineButton,
} from "../../components/UI";
import api from "../../utils/api";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams(); // 👈 job_id from route
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/job-applications/?job_id=${id}`);
      let apps = res.data || [];

      // ❌ filter out completed applications so they don’t show here
      apps = apps.filter((a) => a.status !== "completed");

      setApplications(apps);
    } catch (err) {
      console.log("Error fetching applications:", err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  useEffect(() => {
    if (id) fetchApplications();
  }, [id]);

  // ---------------- Employer Actions ----------------
  const handleAccept = async (applicationId) => {
    try {
      await api.post(`/job-applications/${applicationId}/accept/`);
      Alert.alert(
        "Success",
        "You accepted this worker. Waiting for worker confirmation."
      );
      fetchApplications();
    } catch (err) {
      console.log("Error accepting:", err.message);
      Alert.alert("Error", "Could not accept worker.");
    }
  };

  const handleDecline = async (applicationId) => {
    try {
      await api.post(`/job-applications/${applicationId}/decline/`);
      Alert.alert("Declined", "You declined this worker.");
      fetchApplications();
    } catch (err) {
      console.log("Error declining:", err.message);
      Alert.alert("Error", "Could not decline worker.");
    }
  };

  const handleComplete = async (applicationId) => {
    try {
      await api.post(`/job-applications/${applicationId}/complete/`, {
        role: "employer",
      });
      Alert.alert(
        "Marked Complete",
        "Waiting for worker to confirm completion."
      );
      fetchApplications(); // 👈 after completion it will disappear from here
    } catch (err) {
      console.log("Error completing:", err.message);
      Alert.alert("Error", "Could not mark complete.");
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  // ---------------- Render Buttons by Status ----------------
  const renderActions = (item) => {
    switch (item.status) {
      case "pending":
        return (
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <PrimaryButton
              title="Accept"
              onPress={() => handleAccept(item.id)}
            />
            <OutlineButton
              title="Decline"
              onPress={() => handleDecline(item.id)}
            />
          </View>
        );

      case "waiting_for_worker_confirmation":
        return (
          <PrimaryButton title="Waiting for Worker Confirmation..." disabled />
        );

      case "accepted": // ✅ Only after worker confirms
        return (
          <PrimaryButton
            title="Complete Job"
            onPress={() => handleComplete(item.id)}
          />
        );

      case "waiting_for_worker_completion":
        return (
          <PrimaryButton title="Waiting for Worker Completion..." disabled />
        );

      case "declined":
        return <PrimaryButton title="❌ Declined" disabled />;

      default:
        return null;
    }
  };

  // ---------------- UI ----------------

  return (
    <View style={{ flex: 1, padding: 16, marginTop: 100 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 16 }}>
        Applications for Job #{id}
      </Text>

      <FlatList
        data={applications}
        keyExtractor={(i) => i.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
            tintColor="#689F38"
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Applications"
            subtitle="No workers have applied yet or all jobs are completed."
          />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>
              Worker: {item.worker?.name}
            </Text>
            <Text>Location: {item.worker?.location}</Text>
            <Text>Skills: {item.worker?.skills}</Text>
            <Text>Status: {item.status}</Text>

            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <PrimaryButton
                title="Call"
                onPress={() => handleCall(item.worker?.phone)}
              />
            </View>

            {/* Actions based on status */}
            <View style={{ marginTop: 10 }}>{renderActions(item)}</View>
          </Card>
        )}
      />
    </View>
  );
}
