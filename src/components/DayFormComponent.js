import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Import Supabase
import "./DayFormComponent.css";
import Navbar from "./Navbar";

const supabaseUrl = "https://frzuszxndrfvqcffvzta.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function FormPage() {
  const [formData, setFormData] = useState({
    army_no: "",
    arms_unique_code: "",
    name: "",
    army_rank: "",
    purpose: "",
    date: "",
    time_issued: "",
    index_no: "",
    admin_pin: "",
  });

  const [error, setError] = useState(""); // State to hold error messages

  // Function to update the date and time fields
  const updateDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Formats date as YYYY-MM-DD
    const time_issued = now.toTimeString().slice(0, 5); // Formats time as HH:MM
    setFormData((prevData) => ({
      ...prevData,
      date,
      time_issued,
    }));
  };

  // Run updateDateTime once on component mount and set an interval to update time every minute
  useEffect(() => {
    updateDateTime(); // Set initial date and time
    const interval = setInterval(updateDateTime, 60000); // Update time every minute

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Fetch name and rank based on army_no
  useEffect(() => {
    const fetchNameAndRank = async () => {
      if (formData.army_no.length === 6) { // Trigger only when army_no is valid
        try {
          const { data, error } = await supabase
            .from("army_no_to_name") // Replace with your actual table name
            .select("name, army_rank")
            .eq("army_no", formData.army_no)
            .single();

          if (error) {
            setError("Error fetching details: " + error.message);
            setFormData((prevData) => ({
              ...prevData,
              name: "",
              army_rank: "",
            }));
            return;
          }

          if (data) {
            setFormData((prevData) => ({
              ...prevData,
              name: data.name,
              army_rank: data.army_rank,
            }));
          } else {
            setError("No matching record found.");
            setFormData((prevData) => ({
              ...prevData,
              name: "",
              army_rank: "",
            }));
          }
        } catch (err) {
          setError("Unexpected error occurred while fetching details.");
        }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          name: "",
          army_rank: "",
        }));
      }
    };

    fetchNameAndRank();
  }, [formData.army_no]); // Trigger fetch whenever army_no changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.admin_pin !== "12345") {
      setError("Incorrect Admin Pin. Please try again.");
      return;
    }
  
    setError(""); // Clear any existing errors
  
    try {
      // Step 1: Insert the issued weapon data
      const { error: insertError } = await supabase.from("issued-day-to-day").insert([
        {
          army_no: formData.army_no,
          name: formData.name,
          arms_unique_code: formData.arms_unique_code,
          purpose: formData.purpose,
          date: formData.date,
          time_issued: formData.time_issued,
          index_no: formData.index_no,
          army_rank: formData.army_rank,
        },
      ]);
  
      if (insertError) {
        setError("Error submitting data: " + insertError.message);
        alert("Error in Issuing, Try Again");
        return;
      }
  
      // Step 2: Update the inventory to reduce the quantity of the weapon by 1
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory") // Replace with your actual inventory table name
        .select("quantity")
        .eq("index_no", formData.index_no)
        .single();
  
      if (inventoryError) {
        setError("Error fetching inventory data: " + inventoryError.message);
        return;
      }
  
      if (inventoryData && inventoryData.quantity > 0) {
        const newQuantity = inventoryData.quantity - 1;
  
        const { error: updateError } = await supabase
          .from("inventory") // Replace with your actual inventory table name
          .update({ quantity: newQuantity })
          .eq("index_no", formData.index_no);
  
        if (updateError) {
          setError("Error updating inventory: " + updateError.message);
          return;
        }
      } else {
        setError("Not enough quantity in inventory.");
        return;
      }
  
      alert("Item Issued Successfully");
      setFormData({
        army_no: "",
        arms_unique_code: "",
        name: "",
        army_rank: "",
        purpose: "",
        date: "",
        time_issued: "",
        index_no: "",
        admin_pin: "",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h1 className="form-title">Day-to-Day Issued</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group left">
            <label htmlFor="army_no">Army No (6 characters only)</label>
            <input
              type="text"
              id="army_no"
              name="army_no"
              maxLength="6"
              value={formData.army_no}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              readOnly
            />
            <label htmlFor="army_rank">Army Rank</label>
            <select
              id="army_rank"
              name="army_rank"
              value={formData.army_rank}
              onChange={handleChange}
              required
            >
              <option value="">Select Rank</option>
              <option value="SEP">SEP</option>
              <option value="L/NK">L/NK</option>
              <option value="HAV">HAV</option>
              <option value="NK">NK</option>
              <option value="Cap">Cap</option>
              <option value="Lt">Lt</option>
            </select>
            <label htmlFor="purpose">Purpose</label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            >
              <option value="">Select Purpose</option>
              <option value="Night Duty">Night Duty</option>
              <option value="RP Duty">RP Duty</option>
              <option value="Main Gate Duty">Main Gate Duty</option>
              <option value="MT Duty">MT Duty</option>
            </select>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              readOnly
            />
          </div>
          <div className="form-group right">
            <label htmlFor="arms_unique_code">Arms Unique Code</label>
            <input
              type="text"
              id="arms_unique_code"
              name="arms_unique_code"
              value={formData.arms_unique_code}
              onChange={handleChange}
              required
            />
            <label htmlFor="index_no">Index No (6 characters only)</label>
          <input
            type="text"
            id="index_no"
            name="index_no"
            maxLength="6"
            value={formData.index_no}
            onChange={handleChange}
            required
          />
            <label htmlFor="admin_pin">Admin Pin</label>
            <input
              type="password"
              id="admin_pin"
              name="admin_pin"
              value={formData.admin_pin}
              onChange={handleChange}
              required
            />
            <label htmlFor="time">Time</label>
            <input
              type="time_issued"
              id="time_issued"
              name="time_issued"
              value={formData.time_issued}
              readOnly
            />
          </div>
          <div className="submit-container">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPage;
