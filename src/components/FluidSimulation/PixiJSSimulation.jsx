import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const PixiJSSimulation = ({ particleCount, isRunning, onMetricsUpdate }) => {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  // Inicialização do PixiJS
  useEffect(() => {
    // Verifica se já existe uma aplicação ou se o container não está disponível
    if (appRef.current || !containerRef.current) return;

    const initApp = () => {
      try {
        appRef.current = new PIXI.Application({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
          backgroundColor: 0xf0f0f0,
          antialias: true,
          resizeTo: containerRef.current
        });

        containerRef.current.appendChild(appRef.current.view);
        createParticles();
      } catch (error) {
        console.error('Error initializing PixiJS:', error);
      }
    };

    const createParticles = () => {
      if (!appRef.current) return;

      particlesRef.current = Array.from({ length: particleCount }, () => {
        const particle = new PIXI.Graphics()
          .beginFill(Math.random() * 0xffffff)
          .drawCircle(0, 0, 2)
          .endFill();
        
        particle.x = Math.random() * appRef.current.screen.width;
        particle.y = Math.random() * appRef.current.screen.height;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = (Math.random() - 0.5) * 2;

        appRef.current.stage.addChild(particle);
        return particle;
      });
    };

    initApp();

    return () => {
      cleanUp();
    };
  }, [particleCount]);

  // Animação
  useEffect(() => {
    if (!appRef.current || !isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = () => {
      const startTime = performance.now();

      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > appRef.current.screen.width) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > appRef.current.screen.height) {
          particle.vy *= -1;
        }
      });

      recordRenderTime(startTime);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, recordRenderTime]);

  // Limpeza segura
  const cleanUp = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (appRef.current) {
      try {
        // Remove todos os filhos do stage primeiro
        appRef.current.stage.removeChildren();
        
        // Destrói a aplicação
        appRef.current.destroy({
          children: true,
          texture: true,
          baseTexture: true
        });
        
        // Remove o canvas do DOM se ainda estiver lá
        if (containerRef.current && appRef.current.view) {
          containerRef.current.removeChild(appRef.current.view);
        }
      } catch (error) {
        console.error('Error during cleanup:', error);
      } finally {
        appRef.current = null;
      }
    }
  };

  // Redimensionamento
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current && containerRef.current) {
        appRef.current.renderer.resize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default PixiJSSimulation;
