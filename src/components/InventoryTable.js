import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './InventoryTable.css'; 
import Navbar from "./Navbar"


const supabaseUrl = 'https://frzuszxndrfvqcffvzta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);



const InventoryTable = () => {
  const [inventoryData, setInventoryData] = useState([]); // State to store fetched data

  // Function to fetch inventory data
  const fetchInventoryData = async () => {
    const { data, error } = await supabase
      .from('inventory') // Replace with your actual table name if different
      .select('*'); // Fetch all columns from the inventory table

    if (error) {
      console.error('Error fetching inventory data:', error);
      return [];
    }

    return data;
  };

  // useEffect to fetch data when the component is mounted
  useEffect(() => {
    const getData = async () => {
      const data = await fetchInventoryData();
      setInventoryData(data); // Update the state with the fetched data
    };

    getData();
  }, []); // Empty dependency array to fetch data once on mount

  return (
    <div>
      <Navbar />{   }
    
    <div className="inventory-table-container">
      <h2>Inventory Items</h2>
      {inventoryData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Index No</th>
              <th>Equipment Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr key={index}>
                <td>{item.index_no}</td>
                <td>{item.equipment_name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No inventory data found.</p>
      )}
    </div>
    </div>
  );
};

export default InventoryTable;
