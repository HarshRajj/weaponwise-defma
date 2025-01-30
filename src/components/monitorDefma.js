import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./monitorDefma.css"

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonitorDefma = () => {
  // State variables
  const [fuelLevel, setFuelLevel] = useState(100);
  const [engineTemp, setEngineTemp] = useState(40);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [prevFuelLevel, setPrevFuelLevel] = useState(100);
  const [prevEngineTemp, setPrevEngineTemp] = useState(40);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [kilometers, setKilometers] = useState(0);
  const [maxLimit] = useState(50);
  const [tripDate, setTripDate] = useState("");

  // Chart data states
  const [fuelChartData, setFuelChartData] = useState({
    labels: [],
    datasets: [{ 
      label: "Fuel Level", 
      data: [], 
      borderColor: "#405a24",
      backgroundColor: "rgba(64, 90, 36, 0.2)",
      tension: 0.4
    }]
  });

  const [engineTempChartData, setEngineTempChartData] = useState({
    labels: [],
    datasets: [{ 
      label: "Engine Temperature", 
      data: [], 
      borderColor: "#d9534f",
      backgroundColor: "rgba(217, 83, 79, 0.2)",
      tension: 0.4
    }]
  });

  // Generate a dummy date based on kilometers traveled
  const generateDummyDate = (km) => {
    const baseDate = new Date(2024, 4, 15, 8, 0);
    const hoursToAdd = Math.floor(km * 10);
    const newDate = new Date(baseDate);
    newDate.setHours(baseDate.getHours() + hoursToAdd);
    return newDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Simulate real-time data updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPrevFuelLevel(fuelLevel);
      setPrevEngineTemp(engineTemp);

      setFuelLevel((prevFuel) => {
        if (prevFuel<98 && prevFuel>97 ) return 97;
        
        // Generate a random decrement between 0.1 and 0.4
        const randomDecrement = (Math.random() * (0.6 - 0.1) + 0.1).toFixed(1);
        
        const newFuel = prevFuel - parseFloat(randomDecrement);
        
        return Math.max(newFuel, 0); // Ensure fuel doesn't go below 0
      });

      setEngineTemp((prevTemp) => {
        // Generate a random increment between 0.2 and 0.6
        const randomIncrement = (Math.random() * (1 - 0.2) + 0.2).toFixed(1);
        
        const newTemp = prevTemp + parseFloat(randomIncrement);
        
        return Math.min(newTemp, 105); // Ensure temperature doesn't exceed 90
      });
      
      setLongitude((Math.random() * 360 - 180).toFixed(6));
      setLatitude((Math.random() * 180 - 90).toFixed(6));

      setKilometers(prevKm => {
        const newKm = Math.min(Number((prevKm + 0.1).toFixed(1)), maxLimit);
        setTripDate(generateDummyDate(newKm));
        return newKm;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [fuelLevel, engineTemp, maxLimit]);

  // Check for critical conditions and trigger alerts
  useEffect(() => {
    const messages = [];
    const fuelDrop = prevFuelLevel - fuelLevel;
    const tempCrossed = prevEngineTemp <= 90 && engineTemp > 90;

    if (fuelDrop > 0.5) {
      messages.push(`⛽ Fuel level dropped by ${fuelDrop.toFixed(2)} units!`);
    }
    if (tempCrossed) {
      messages.push(`🌡️ Engine temperature crossed 90°C (Current: ${engineTemp.toFixed(1)}°C)!`);
    }

    if (messages.length > 0) {
      setAlertMessage(messages.join("\n"));
      setShowAlert(true);
    }
  }, [fuelLevel, prevFuelLevel, engineTemp, prevEngineTemp]);

  // Update chart data
  useEffect(() => {
    setFuelChartData(prev => ({
      labels: [...prev.labels, new Date().toLocaleTimeString()].slice(-15),
      datasets: [{ ...prev.datasets[0], data: [...prev.datasets[0].data, fuelLevel].slice(-15) }]
    }));

    setEngineTempChartData(prev => ({
      labels: [...prev.labels, new Date().toLocaleTimeString()].slice(-15),
      datasets: [{ ...prev.datasets[0], data: [...prev.datasets[0].data, engineTemp].slice(-15) }]
    }));
  }, [fuelLevel, engineTemp]);

  return (
    <div className="monitor-container">
      {showAlert && (
        <div className="top-alert">
          <div className="alert-content">
            <h2>🚨 CRITICAL WARNING 🚨</h2>
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)}>Acknowledge</button>
          </div>
        </div>
      )}

      <h1 className="live-monitoring-title">Vehicle Monitoring Dashboard</h1>

      <div className="metrics-container">
        <div className="metric-box fuel-level">
          <h3>Fuel Level</h3>
          <div className="metric-value">{fuelLevel.toFixed(1)}%</div>
        </div>
        
        <div className="metric-box engine-temp">
          <h3>Engine Temp</h3>
          <div className="metric-value">{engineTemp.toFixed(1)}°C</div>
        </div>
        
        <div className="metric-box odometer">
          <h3>Distance Traveled</h3>
          <div className="metric-value">
            {kilometers.toFixed(1)}<span className="unit">km</span>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="graph-section">
          <Line data={fuelChartData} options={chartOptions("Fuel Level", "%")} />
        </div>
        
        <div className="graph-section">
          <Line data={engineTempChartData} options={chartOptions("Engine Temperature", "°C")} />
        </div>
      </div>

      <div className="odometer-section">
        <h2>Journey Progress</h2>
        <div className="odometer-container">
          <div className="odometer-display">
            <div className="odometer-label">Distance Traveled</div>
            <div className="odometer-value">
              {kilometers.toFixed(1).padStart(5, '0')}
              <span className="odometer-unit">km</span>
            </div>
            <div className="dummy-date">{tripDate}</div>
          </div>
          <div className="max-limit">
            <div className="limit-label">Max Limit</div>
            <div className="limit-value">
              {maxLimit.toFixed(1)}
              <span className="limit-unit">km</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gps-section">
        <h2>GPS Coordinates</h2>
        <div className="gps-container">
          <div className="gps-box">
            <span className="gps-label">Longitude:</span>
            <span className="gps-value">{longitude}</span>
          </div>
          <div className="gps-box">
            <span className="gps-label">Latitude:</span>
            <span className="gps-value">{latitude}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart options configuration
const chartOptions = (title, unit) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: { 
        display: true, 
        text: "Time",
        color: "#405a24"
      },
      grid: { color: "rgba(64, 90, 36, 0.1)" }
    },
    y: {
      title: { 
        display: true, 
        text: unit,
        color: "#405a24"
      },
      grid: { color: "rgba(64, 90, 36, 0.1)" }
    }
  },
  plugins: {
    legend: { 
      position: "top",
      labels: { color: "#405a24" }
    },
    title: { 
      display: true, 
      text: title,
      color: "#405a24",
      font: { size: 18 }
    }
  }
});

export default MonitorDefma;