import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Import Supabase
import './IssuedItemsTable.css';
import Navbar from "./Navbar";

const supabaseUrl = 'https://frzuszxndrfvqcffvzta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IssuedItemsTable = () => {
  const [issuedData, setIssuedData] = useState([]); // State to store fetched data
  const [selectedDate, setSelectedDate] = useState(''); // State for selected date

  // Function to fetch data (with optional date filtering)
  const fetchIssuedData = async (selectedDate) => {
    let query = supabase.from('completed-table').select(`
      army_no,
      arms_unique_code,
      name,
      army_rank,
      purpose,
      date,
      time_issued,
      time_returned,
      index_no
    `);

    // Apply date filter if selectedDate is provided
    if (selectedDate) {
      query = query.eq('date', selectedDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching issued data:', error);
      return [];
    }

    return data;
  };

  // useEffect to fetch data when the component mounts or selectedDate changes
  useEffect(() => {
    const getData = async () => {
      const data = await fetchIssuedData(selectedDate || null); // Fetch all if no date is selected
      setIssuedData(data);
    };

    getData();
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Update selected date
  };

  return (
    <div>
      <Navbar />

      <div className="table-container">
        <h3>Choose Date:</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange} // Call handleDateChange on input
        />
        <h2>Issued Items {selectedDate ? `for ${selectedDate}` : ''}</h2>

        {issuedData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Army No</th>
                <th>Name</th>
                <th>Army Rank</th>
                <th>Index No</th>
                <th>Arms Unique Code</th>
                <th>Purpose</th>
                <th>Date</th>
                <th>Time Of Issue</th>
                <th>Time Of Return</th>

              </tr>
            </thead>
            <tbody>
              {issuedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.army_no}</td>
                  <td>{item.name}</td>
                  <td>{item.army_rank}</td>
                  <td>{item.index_no}</td>
                  <td>{item.arms_unique_code}</td>
                  <td>{item.purpose}</td>
                  <td>{item.date}</td>
                  <td>{item.time_issued}</td>
                  <td>{item.time_returned}</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{selectedDate ? 'No data found for the selected date.' : 'No data available.'}</p>
        )}
      </div>
    </div>
  );
};

export default IssuedItemsTable;
