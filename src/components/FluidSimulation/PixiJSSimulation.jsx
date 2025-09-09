import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const PixiJSSimulation = ({ particleCount, isRunning, onMetricsUpdate, speedFactor = 3 }) => {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  // Inicialização do PixiJS
  useEffect(() => {
    if (!containerRef.current) return;

    const initPixiApp = async () => {
      try {
        // Destruir aplicação existente se houver
        if (appRef.current) {
          appRef.current.destroy(true);
          appRef.current = null;
        }

        // Criar nova aplicação PixiJS
        appRef.current = new PIXI.Application();

        // Inicializar com a configuração correta do background
        await appRef.current.init({
          background: '#F0F0F0',
          resizeTo: containerRef.current,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true
        });

        // Adicionar canvas ao container
        const canvas = appRef.current.canvas;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(canvas);

        // Criar partículas
        createParticles();

        // Iniciar animação se estiver running
        if (isRunning) {
          startAnimation();
        }

      } catch (error) {
        console.error('Error initializing PixiJS:', error);
      }
    };

    const createParticles = () => {
      if (!appRef.current) return;

      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(Math.random() * 0xFFFFFF);
        graphics.drawCircle(0, 0, 2);
        graphics.endFill();

        graphics.x = Math.random() * appRef.current.screen.width;
        graphics.y = Math.random() * appRef.current.screen.height;
        
        // Aplica speedFactor nas velocidades iniciais
        graphics.vx = (Math.random() - 0.5) * 4 * speedFactor;
        graphics.vy = (Math.random() - 0.5) * 4 * speedFactor;

        appRef.current.stage.addChild(graphics);
        particlesRef.current.push(graphics);
      }
    };

    const startAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const animate = () => {
        if (!isRunning || !appRef.current) return;

        const startTime = performance.now();

        // Atualizar partículas com speedFactor aplicado
        particlesRef.current.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Colisão com bordas
          if (particle.x < 0 || particle.x > appRef.current.screen.width) {
            particle.vx *= -1;
          }
          if (particle.y < 0 || particle.y > appRef.current.screen.height) {
            particle.vy *= -1;
          }
        });

        recordRenderTime(startTime);
        
        if (isRunning) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    initPixiApp();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      if (appRef.current) {
        setTimeout(() => {
          if (appRef.current) {
            try {
              appRef.current.destroy(true);
            } catch (e) {
              console.warn('Error during PixiJS cleanup:', e);
            }
            appRef.current = null;
          }
        }, 0);
      }
    };
  }, [particleCount, speedFactor]); // Adiciona speedFactor como dependência

  // Controle de animação separado
  useEffect(() => {
    if (!appRef.current || particlesRef.current.length === 0) return;

    if (isRunning) {
      startAnimation();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    function startAnimation() {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const animate = () => {
        if (!isRunning || !appRef.current) return;

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
        
        if (isRunning) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, recordRenderTime]);

  // Atualizar velocidades quando speedFactor mudar
  useEffect(() => {
    if (!appRef.current || particlesRef.current.length === 0) return;

    // Atualiza as velocidades existentes com o novo speedFactor
    particlesRef.current.forEach(particle => {
      const originalSpeedX = Math.abs(particle.vx) / speedFactor;
      const originalSpeedY = Math.abs(particle.vy) / speedFactor;
      const directionX = Math.sign(particle.vx);
      const directionY = Math.sign(particle.vy);
      
      particle.vx = directionX * originalSpeedX * speedFactor;
      particle.vy = directionY * originalSpeedY * speedFactor;
    });
  }, [speedFactor]);

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

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        backgroundColor: '#F0F0F0',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }} 
    />
  );
};

export default PixiJSSimulation;
