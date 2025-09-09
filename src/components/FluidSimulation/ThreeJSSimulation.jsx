import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const ThreeJSSimulation = ({ particleCount, isRunning, onMetricsUpdate, speedFactor = 3}) => {
  const mountRef = useRef(null);
  const particlesRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000));
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const velocitiesRef = useRef([]);
  
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    // Initialize Three.js scene
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(width, height);
    mountRef.current.appendChild(rendererRef.current.domElement);
    
    // Configura câmera ortográfica para visão 2D
    const aspectRatio = width / height;
    cameraRef.current.left = -aspectRatio;
    cameraRef.current.right = aspectRatio;
    cameraRef.current.top = 1;
    cameraRef.current.bottom = -1;
    cameraRef.current.updateProjectionMatrix();
    cameraRef.current.position.z = 5;
    
    // Configura fundo cinza claro
    sceneRef.current.background = new THREE.Color(0xf0f0f0);
    
    // Create particles as circles (usando esferas para parecerem círculos em 2D)
    const particles = new THREE.Group();
    const boundaryX = aspectRatio;
    const boundaryY = 1;
    
    // Inicializa velocidades
    velocitiesRef.current = Array.from({ length: particleCount }, () => ({
      vx: (Math.random() - 0.5) * 0.02 * speedFactor,
      vy: (Math.random() - 0.5) * 0.02 * speedFactor
    }));
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.011 + Math.random() * 0.003;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
      });
      
      const particle = new THREE.Mesh(geometry, material);
      
      // Posições iniciais dentro dos limites
      particle.position.x = (Math.random() - 0.5) * 2 * (boundaryX - radius);
      particle.position.y = (Math.random() - 0.5) * 2 * (boundaryY - radius);
      
      particles.add(particle);
    }
    
    particlesRef.current = particles;
    sceneRef.current.add(particlesRef.current);
    
    // Handle window resize
    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      rendererRef.current.setSize(newWidth, newHeight);
      
      const newAspectRatio = newWidth / newHeight;
      cameraRef.current.left = -newAspectRatio;
      cameraRef.current.right = newAspectRatio;
      cameraRef.current.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount, speedFactor]);
  
  useEffect(() => {
    if (!isRunning) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }
    
    const animate = () => {
      const startTime = performance.now();
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const aspectRatio = width / height;
      const boundaryX = aspectRatio;
      const boundaryY = 1;
      
      // Atualiza posições das partículas
      particlesRef.current.children.forEach((particle, i) => {
        const velocity = velocitiesRef.current[i];
        const radius = particle.geometry.parameters.radius;
        
        // Atualiza posições
        particle.position.x += velocity.vx;
        particle.position.y += velocity.vy;
        
        // Verifica colisões com as bordas e inverte a velocidade
        if (particle.position.x < -boundaryX + radius || particle.position.x > boundaryX - radius) {
          velocity.vx *= -1;
          // Corrige posição para não sair dos limites
          particle.position.x = Math.max(-boundaryX + radius, Math.min(boundaryX - radius, particle.position.x));
        }
        
        if (particle.position.y < -boundaryY + radius || particle.position.y > boundaryY - radius) {
          velocity.vy *= -1;
          // Corrige posição para não sair dos limites
          particle.position.y = Math.max(-boundaryY + radius, Math.min(boundaryY - radius, particle.position.y));
        }
      });
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      recordRenderTime(startTime);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animationIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRunning, particleCount, recordRenderTime, speedFactor]);
  
  return <div ref={mountRef} className="simulation-view" style={{ width: '100%', height: '400px' }} />;
};

export default ThreeJSSimulation;
