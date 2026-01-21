import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const RealtimeChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Analog Input',
        data: [],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.2)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBorderColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  });

  const addData = (value) => {
    const newChartData = {
      ...chartData,
      labels: [...chartData.labels, new Date().toLocaleTimeString()],
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data, value],
      })),
    };
    setChartData(newChartData);
  };

  useEffect(() => {
    // Connect to the analog data source and listen for new data
    const intervalId = setInterval(() => {
      const value = Math.random() * 100; // Replace this with your own analog data source
      addData(value);
    }, 1000);

    // Disconnect from the analog data source when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default RealtimeChart;