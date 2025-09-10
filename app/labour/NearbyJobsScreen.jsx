import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, RefreshControl } from "react-native";
import {
  Card,
  EmptyState,
  OutlineButton,
  PrimaryButton,
} from "../components/UI";
import api from "../utils/api";
import { getUser } from "../utils/auth";

export default function NearbyJobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState({}); // jobId -> application

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      fetchData(u);
    })();
  }, []);

  const fetchData = async (u = user) => {
    if (!u) return;
    try {
      setLoading(true);

      const res = await api.get("/jobs/");
      const jobList = res.data || [];
      setJobs(jobList);

      // fetch this worker's application for each job
      const appMap = {};
      for (const job of jobList) {
        const url = `/job-applications/get_by_job_and_worker/?job_id=${job.id}&worker_phone=${u.phone}`;

        try {
          const appRes = await api.get(url);
          if (appRes.data && appRes.data.id) {
            appMap[job.id] = appRes.data;
          }
        } catch (err) {
          console.log("❌ No application for job", job.id, err.message);
        }
      }
      setApplications(appMap);
    } catch (error) {
      console.error("🔥 Jobs fetch error:", error.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // --- Worker Actions ---
  const applyJob = async (jobId) => {
    try {
      await api.post("/job-applications/apply/", {
        job: jobId,
        worker_phone: user.phone,
      });
      Alert.alert("Success", "You have applied for this job.");
      fetchData();
    } catch (error) {
      console.error("🔥 Apply error:", error.message);
      Alert.alert("Error", "Could not apply.");
    }
  };

  const confirmJob = async (applicationId) => {
    try {
      await api.post(`/job-applications/${applicationId}/worker_accept/`);
      Alert.alert("Confirmed", "You accepted the job.");
      fetchData();
    } catch (error) {
      console.error("🔥 Confirm error:", error.message);
      Alert.alert("Error", "Could not confirm job.");
    }
  };

  const declineJob = async (applicationId) => {
    try {
      await api.post(`/job-applications/${applicationId}/worker_decline/`);
      Alert.alert("Declined", "You declined the job.");
      fetchData();
    } catch (error) {
      console.error("🔥 Decline error:", error.message);
      Alert.alert("Error", "Could not decline job.");
    }
  };

  const completeJob = async (applicationId) => {
    try {
      await api.post(`/job-applications/${applicationId}/complete/`, {
        role: "worker",
      });
      Alert.alert("Done ✅", "You marked this job as complete.");
      fetchData();
    } catch (error) {
      console.error("🔥 Complete error:", error.message);
      Alert.alert("Error", "Could not complete job.");
    }
  };

  // --- UI Logic for buttons ---
  const renderActionButton = (jobId) => {
    if (!user) return null;

    const myApp = applications[jobId]; // comes from state

    if (!myApp) {
      return <OutlineButton title="Apply" onPress={() => applyJob(jobId)} />;
    }

    if (!myApp.employer_accept) {
      return <PrimaryButton title="Waiting for Employer…" disabled />;
    }

    if (myApp.employer_accept && !myApp.worker_accept) {
      return (
        <View style={{ flexDirection: "row" }}>
          <PrimaryButton title="Confirm" onPress={() => confirmJob(myApp.id)} />
          <OutlineButton title="Decline" onPress={() => declineJob(myApp.id)} />
        </View>
      );
    }

    // ✅ Both accepted → show "Complete Job"
    if (
      myApp.employer_accept &&
      myApp.worker_accept &&
      myApp.status !== "completed"
    ) {
      return (
        <PrimaryButton
          title="Complete Job"
          onPress={() => completeJob(myApp.id)}
        />
      );
    }

    if (myApp.status === "completed") {
      return <PrimaryButton title="✅ Completed" disabled />;
    }

    if (myApp.status === "declined") {
      return <PrimaryButton title="❌ Declined" disabled />;
    }

    return null;
  };

  // --- Render ---
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", paddingBottom: 20 }}>
        Nearby Jobs
      </Text>

      <FlatList
        data={jobs.filter((j) => j.status !== "completed")} // hide completed from list
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
            title="No Jobs Nearby"
            subtitle="No open jobs in your location."
          />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 6 }}>
              {item.work_type}
            </Text>
            <Text>Date: {item.work_date}</Text>
            <Text>Employer: {item.employer_phone}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Wage: ₹{item.wage}</Text>
            <Text>Detail: {item.detail}</Text>
            <Text style={{ marginBottom: 8 }}>Status: {item.status}</Text>

            {renderActionButton(item.id)}
          </Card>

        )}
      />
    </View>
  );
}
