import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceMetrics = ({ metrics }) => {
  if (Object.keys(metrics).length === 0) {
    return <div className="metrics-container">Execute o benchmark para ver métricas</div>;
  }

  const libraries = Object.keys(metrics);
  const fpsData = libraries.map(lib => metrics[lib].fps);
  const memoryData = libraries.map(lib => metrics[lib].memory);
  const renderTimeData = libraries.map(lib => metrics[lib].renderTime);

  const fpsChartData = {
    labels: libraries,
    datasets: [
      {
        label: 'FPS',
        data: fpsData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const memoryChartData = {
    labels: libraries,
    datasets: [
      {
        label: 'Memory Usage (MB)',
        data: memoryData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  const renderTimeChartData = {
    labels: libraries,
    datasets: [
      {
        label: 'Render Time (ms)',
        data: renderTimeData,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      }
    ]
  };

  return (
    <div className="metrics-container">
      <h2>Métricas de Desempenho</h2>
      <div className="charts-row">
        <div className="chart-container">
          <Bar data={fpsChartData} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Frames por Segundo (FPS)' }
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="chart-container">
          <Bar data={memoryChartData} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Uso de Memória (MB)' }
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="chart-container">
          <Bar data={renderTimeChartData} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Tempo de Renderização (ms)' }
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;