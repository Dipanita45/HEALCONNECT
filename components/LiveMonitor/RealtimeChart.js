import React, { useState, useEffect, useCallback } from 'react';
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

  // Memoized addData function to prevent warning
  const addData = useCallback((value) => {
    setChartData((prevChartData) => ({
      ...prevChartData,
      labels: [...prevChartData.labels, new Date().toLocaleTimeString()],
      datasets: prevChartData.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data, value],
      })),
    }));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const value = Math.random() * 100;
      addData(value);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addData]); // This is now stable and will not cause warning

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default RealtimeChart;
