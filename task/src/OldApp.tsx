import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

function App() {
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

  const handlePointClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];
      console.log(`Label: ${label}`);
    }
  };

  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <h2>Chart</h2>
      <Line
        data={chartData}
        options={{
          onHover: handlePointClick,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const labelIndex = context.dataIndex;
                  const datasetIndex = context.datasetIndex;
                  return `Label: ${chartData.labels[labelIndex]}`;
                },
              },
            },
          },
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default App;
