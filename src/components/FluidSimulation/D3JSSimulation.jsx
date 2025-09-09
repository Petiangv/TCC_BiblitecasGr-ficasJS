import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const D3JSSimulation = ({ particleCount, isRunning, onMetricsUpdate, speedFactor = 1 }) => {
  const svgRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    // Limpa o SVG antes de começar
    svg.selectAll('*').remove();

    // Cria partículas com velocidades base
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2 * speedFactor,
      vy: (Math.random() - 0.5) * 2 * speedFactor,
      radius: 1.1 + Math.random() * 1.1,
      color: d3.interpolateRainbow(Math.random())
    }));

    // OTIMIZAÇÃO: Usa um único elemento <g> para todas as partículas
    const container = svg.append('g');
    
    // Desenha partículas iniciais - mais eficiente
    const circles = container.selectAll('circle')
      .data(particlesRef.current)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    lastTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 16.67; // Normalizado para 60fps
      lastTimeRef.current = currentTime;

      const startTime = performance.now();

      // Atualiza posições com delta time para movimento suave
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;

        // Colisão com bordas
        if (particle.x < particle.radius) {
          particle.x = particle.radius;
          particle.vx = Math.abs(particle.vx);
        } else if (particle.x > width - particle.radius) {
          particle.x = width - particle.radius;
          particle.vx = -Math.abs(particle.vx);
        }

        if (particle.y < particle.radius) {
          particle.y = particle.radius;
          particle.vy = Math.abs(particle.vy);
        } else if (particle.y > height - particle.radius) {
          particle.y = height - particle.radius;
          particle.vy = -Math.abs(particle.vy);
        }
      });

      // OTIMIZAÇÃO: Atualização em lote usando data binding
      circles
        .data(particlesRef.current)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      recordRenderTime(startTime);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, particleCount, recordRenderTime, speedFactor]);

  return (
    <svg 
      ref={svgRef} 
      className="simulation-view" 
      style={{ width: '100%', height: '400px', background: '#f0f0f0' }}
    />
  );
};

export default D3JSSimulation;
