import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Import Supabase
import './CleanFormComponent.css';
import Navbar from "./Navbar"

const supabaseUrl = 'https://frzuszxndrfvqcffvzta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function FormPage() {
  const [formData, setFormData] = useState({
    army_no: '',
    arms_unique_code: '',
    army_rank: '',
    purpose: '',
    date: '',
    time: '',
    index_no: '',
    number: '',
    admin_pin: '',
  });

  const [error, setError] = useState(''); // State to hold error messages

  // Function to update the date and time fields
  const updateDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    setFormData((prevData) => ({
      ...prevData,
      date,
      time,
    }));
  };

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.admin_pin !== '12345') {
      setError('Incorrect Admin Pin. Please try again.');
      return;
    }

    setError('');
    console.log('Form Data Submitted:', formData);
      // Insert data into Supabase database
      const { data, error: insertError } = await supabase
      .from('issued-clean') // Replace with your table name
      .insert([
        {
          army_no: formData.army_no,
          arms_unique_code: formData.arms_unique_code,
          army_rank: formData.army_rank,
          purpose: formData.purpose,
          date: formData.date,
          time: formData.time,
          index_no: formData.index_no,
          number: formData.number,
        },
      ]);

    if (insertError) {
      setError('Error submitting data: ' + insertError.message);
      console.log(insertError);
      alert("Error in Issuing, Try Again");
    } else {
      console.log('Form Data Submitted:', data);
      alert("Item Issued Sucessfully");
      // Optionally reset the form or show a success message
    }
  };


  

  return (
    <div> 
      <Navbar />{   }
    
    <div className="form-container">
      <h1 className="form-title">Clean_Issued</h1>

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

          <label htmlFor="army_rank">Army Rank</label>
          <select
            id="army_rank"
            name="army_rank"
            value={formData.army_rank}
            onChange={handleChange}
            required
          >
            <option value="">Select Rank</option>
            <option value="JCO">JCO</option>
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
            <option value="Annual Inspection">Annual Inspection</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Weekly">Weekly</option>
          </select>

          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            readOnly
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
        </div>

        <div className="form-group right">
          <label htmlFor="arms_unique_code">Arms Unique Code(6 characters only)</label>
          <input
            type="text"
            id="arms_unique_code"
            name="arms_unique_code"
            maxLength="6"
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

          <label htmlFor="number">Number(1 to 10)</label>
          <input
            type="number"
            id="number"
            name="number"
            min="1"
            max="10"
            value={formData.number}
            onChange={handleChange}
            required
          />
           <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
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
