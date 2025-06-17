import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const D3JSSimulation = ({ particleCount, isRunning, onMetricsUpdate }) => {
  const svgRef = useRef(null);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    if (!isRunning) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    // Limpa o SVG antes de começar
    svg.selectAll('*').remove();

    // Cria partículas
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));

    // Desenha partículas iniciais
    const circles = svg.selectAll('circle')
      .data(particles)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('fill', () => d3.interpolateRainbow(Math.random()));

    let animationFrame;

    const animate = () => {
      const startTime = performance.now();

      circles
        .attr('cx', d => {
          d.x += d.vx;
          if (d.x < 0 || d.x > width) d.vx *= -1;
          return d.x;
        })
        .attr('cy', d => {
          d.y += d.vy;
          if (d.y < 0 || d.y > height) d.vy *= -1;
          return d.y;
        });

      recordRenderTime(startTime);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isRunning, particleCount, recordRenderTime]);

  return (
    <svg 
      ref={svgRef} 
      className="simulation-view" 
      style={{ width: '100%', height: '400px', background: '#f0f0f0' }}
    />
  );
};

export default D3JSSimulation;