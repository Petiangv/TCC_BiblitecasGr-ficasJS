import React, { useEffect, useRef } from 'react';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';
import p5 from 'p5';

const P5JSSimulation = ({ particleCount, isRunning, onMetricsUpdate }) => {
  const canvasContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const particlesRef = useRef([]);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(
          canvasContainerRef.current.clientWidth,
          canvasContainerRef.current.clientHeight
        );
        canvas.style('display', 'block');
        
        particlesRef.current = Array.from({ length: particleCount }, () => ({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-2, 2),
          vy: p.random(-2, 2),
          color: p.color(p.random(255), p.random(255), p.random(255))
        }));
      };

      p.draw = () => {
        if (!isRunning) {
          p.background(240);
          return;
        }

        const startTime = performance.now();
        p.background(240);

        particlesRef.current.forEach(particle => {
          p.fill(particle.color);
          p.noStroke();
          p.circle(particle.x, particle.y, 4);

          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
        });

        recordRenderTime(startTime);
      };

      p.windowResized = () => {
        p.resizeCanvas(
          canvasContainerRef.current.clientWidth,
          canvasContainerRef.current.clientHeight
        );
      };
    };

    p5InstanceRef.current = new p5(sketch, canvasContainerRef.current);

    return () => {
      p5InstanceRef.current?.remove();
      p5InstanceRef.current = null;
    };
  }, [particleCount, isRunning, recordRenderTime]);

  return <div ref={canvasContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default P5JSSimulation;
