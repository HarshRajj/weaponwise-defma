import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import NavbarDefma from "./NavbarDefma";
import "./allotted.css"; // Add styles

// Supabase Configuration
const supabase = createClient(
  "https://frzuszxndrfvqcffvzta.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA"
);

const Allotted = () => {
  const [requests, setRequests] = useState([]);

  // Function to fetch data from Supabase
  const fetchRequests = async () => {
    const { data, error } = await supabase.from("request_table").select("*");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setRequests(data);
    }
  };

  useEffect(() => {
    fetchRequests(); // Fetch data when the component loads

    // Optional: Real-time updates when new data is inserted
    const subscription = supabase
      .channel("request_table")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "request_table" }, fetchRequests)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div>
      <NavbarDefma />
      <h1 className="table-title">Allotted Requests</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Army No</th>
              <th>Name</th>
              <th>Rank</th>
              <th>Type of Vehicle</th>
              <th>Purpose</th>
              <th>Estimated Distance (km)</th>
              <th>Date</th>
              <th>Time</th>
              <th>Return Time</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.army_no}</td>
                  <td>{req.name}</td>
                  <td>{req.rank}</td>
                  <td>{req.type_of_vehicle}</td>
                  <td>{req.purpose}</td>
                  <td>{req.estimated_distance}</td>
                  <td>{req.date}</td>
                  <td>{req.time}</td>
                  <td>{req.estimated_time_of_return}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No requests available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Allotted;
