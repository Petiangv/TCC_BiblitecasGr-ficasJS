import React, { useEffect, useRef } from 'react';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';
import p5 from 'p5';

const P5JSSimulation = ({ particleCount, isRunning, onMetricsUpdate }) => {
  const canvasContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const particlesRef = useRef([]);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    if (!canvasContainerRef.current || p5InstanceRef.current) return;

    const sketch = (p) => {
      p.setup = () => {
        const container = canvasContainerRef.current;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 400;
        
        const canvas = p.createCanvas(width, height);
        canvas.style('display', 'block');
        
        // Inicializar partículas como no original
        particlesRef.current = Array.from({ length: particleCount }, () => ({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-2, 2),
          vy: p.random(-2, 2),
          color: p.color(p.random(255), p.random(255), p.random(255))
        }));

        if (!isRunning) {
          p.noLoop();
        }
      };

      p.draw = () => {
        const startTime = performance.now();
        
        // Limpar canvas completamente (sem alpha)
        p.background(240);

        // Renderizar partículas
        particlesRef.current.forEach(particle => {
          p.fill(particle.color);
          p.noStroke();
          p.circle(particle.x, particle.y, 4);

          // Atualizar posição apenas se estiver running
          if (isRunning) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Colisão com bordas (simples como no original)
            if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
          }
        });

        recordRenderTime(startTime);
      };

      p.windowResized = () => {
        if (!canvasContainerRef.current) return;
        const container = canvasContainerRef.current;
        p.resizeCanvas(container.clientWidth, container.clientHeight);
      };
    };

    p5InstanceRef.current = new p5(sketch, canvasContainerRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [particleCount]);

  // Efeito para controlar play/pause
  useEffect(() => {
    if (p5InstanceRef.current) {
      if (isRunning) {
        p5InstanceRef.current.loop();
      } else {
        p5InstanceRef.current.noLoop();
        p5InstanceRef.current.redraw();
      }
    }
  }, [isRunning]);

  return (
    <div 
      ref={canvasContainerRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default P5JSSimulation;
