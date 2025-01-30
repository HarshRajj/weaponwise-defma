import React, { useState } from "react";
import NavbarDefma from "./NavbarDefma";
import { createClient } from "@supabase/supabase-js";
import "./defmaRequestForm.css"; // Import CSS file

// Supabase Configuration
const supabase = createClient(
  "https://frzuszxndrfvqcffvzta.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA"
);

const RequestForm = () => {
  const [formData, setFormData] = useState({
    army_no: "",
    name: "",
    rank: "",
    type_of_vehicle: "",
    purpose: "",
    purpose_description: "",
    estimated_distance: "",
    time: "",
    date: "",
    estimated_time_of_return: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("request_table").insert([formData]);

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Form submitted successfully!");
        setFormData({
          army_no: "",
          name: "",
          rank: "",
          type_of_vehicle: "",
          purpose: "",
          purpose_description: "",
          estimated_distance: "",
          time: "",
          date: "",
          estimated_time_of_return: "",
        });
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavbarDefma />
      <h1 className="form-title">Request Form</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-content">
          
          {/* Left Side */}
          <div className="form-left">
            <label className="form-label">Army No:</label>
            <input type="text" name="army_no" onChange={handleChange} value={formData.army_no} required />

            <label className="form-label">Rank:</label>
            <input type="text" name="rank" onChange={handleChange} value={formData.rank} required />

            <label className="form-label">Type of Vehicle:</label>
            <select name="type_of_vehicle" onChange={handleChange} value={formData.type_of_vehicle} required>
              <option value="">Select Vehicle Type</option>
              <option value="2.5 Tonn">2.5 Tonn</option>
              <option value="Bullet">Bullet</option>
              <option value="Gypsy">Gypsy</option>
              <option value="Stallion">Stallion</option>
              <option value="Scorpio">Scorpio</option>
              <option value="Safari">Safari</option>
              <option value="CD 100">CD 100</option>
              <option value="School Bus">School Bus</option>
            </select>

            <label className="form-label">Date:</label>
            <input type="date" name="date" onChange={handleChange} value={formData.date} required />

            <label className="form-label">Estimated Time of Return:</label>
            <input type="time" name="estimated_time_of_return" onChange={handleChange} value={formData.estimated_time_of_return} required />
          </div>

          {/* Right Side */}
          <div className="form-right">
            <label className="form-label">Name:</label>
            <input type="text" name="name" onChange={handleChange} value={formData.name} required />

            <label className="form-label">Estimated Distance (km):</label>
            <input type="number" name="estimated_distance" onChange={handleChange} value={formData.estimated_distance} required />

            <label className="form-label">Purpose:</label>
            <select name="purpose" onChange={handleChange} value={formData.purpose} required>
              <option value="">Select Purpose</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>

            {/* Show "Describe Purpose" only when a purpose is selected */}
            {formData.purpose && (
              <>
                <label className="form-label">Describe Purpose:</label>
                <textarea name="purpose_description" onChange={handleChange} value={formData.purpose_description} required />
              </>
            )}

            <label className="form-label">Time:</label>
            <input type="time" name="time" onChange={handleChange} value={formData.time} required />
          </div>
          
          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};  

export default RequestForm;
