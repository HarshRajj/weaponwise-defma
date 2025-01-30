import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

const MonitorChart = () => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    socket.on("sensor_update", (newData) => {
      setDataPoints((prev) => [...prev.slice(-20), newData]); // Keep only last 20 points
    });

    return () => socket.off("sensor_update");
  }, []);

  const chartData = {
    labels: dataPoints.map((_, index) => index),
    datasets: [
      {
        label: "Fuel Level",
        data: dataPoints.map((data) => data.fuel),
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Engine Temp",
        data: dataPoints.map((data) => data.engine_temp),
        borderColor: "red",
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default MonitorChart;
