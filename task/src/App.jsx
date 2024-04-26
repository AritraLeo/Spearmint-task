import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js'; // Import Chart.js

function App() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Y-axis',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'X-axis',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const yDataResponse = await fetch('https://retoolapi.dev/o5zMs5/data');
      const yData = await yDataResponse.json();

      const xDataResponse = await fetch('https://retoolapi.dev/gDa8uC/data');
      const xData = await xDataResponse.json();

      const slicedYData = yData.slice(0, 50);
      const slicedXData = xData.slice(0, 50);

      const labels = slicedXData.map((item) => item.Label || 'Label');

      const yValues = slicedYData.map((item) => parseFloat(item.RandomNumber));
      const xValues = slicedXData.map((item) => parseFloat(item.RandomNumber));

      setChartData({
        labels,
        datasets: [
          { ...chartData.datasets[0], data: yValues },
          { ...chartData.datasets[1], data: xValues },
        ],
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart before creating a new one
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      chartRef.current.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const labelIndex = context.dataIndex;
                  return `Label: ${chartData.labels[labelIndex]}`;
                },
              },
            },
          },
        },
      });
    }
  }, [chartData]);

  return (
    <div className="App" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
  <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Chart Task</h1>
  <div style={{ width: '100vw', maxWidth: '800px', height: '80%', maxHeight: '600px' }}>
    <canvas ref={chartRef} /> {/* Remove width and height styles */}
  </div>
</div>

  );
}

export default App;
