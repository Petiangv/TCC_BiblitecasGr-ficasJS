import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const ChartJSSimulation = ({ particleCount, isRunning, onMetricsUpdate }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const animationRef = useRef(null);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    if (!isRunning) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    if (!canvasRef.current) return;

    // Cria dados iniciais
    const data = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));

    // Configuração do gráfico
    const config = {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Fluid Particles',
          data: data,
          pointRadius: 2,
          pointBackgroundColor: data.map(() => 
            `hsl(${Math.random() * 360}, 100%, 50%)`
          )
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { min: 0, max: 100 },
          y: { min: 0, max: 100 }
        },
        animation: false,
        plugins: {
          legend: { display: false }
        }
      }
    };

    chartRef.current = new Chart(canvasRef.current, config);

    // Função de animação
    const animate = () => {
      const startTime = performance.now();

      const dataset = chartRef.current.data.datasets[0];
      dataset.data.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > 100) point.vx *= -1;
        if (point.y < 0 || point.y > 100) point.vy *= -1;
      });

      chartRef.current.update();
      recordRenderTime(startTime);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, particleCount, recordRenderTime]);

  return <canvas ref={canvasRef} className="simulation-view" />;
};

export default ChartJSSimulation;