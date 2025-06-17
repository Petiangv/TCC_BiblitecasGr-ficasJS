import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import usePerformanceMetrics from '../../hooks/usePerformanceMetrics';

const ThreeJSSimulation = ({ particleCount, isRunning, onMetricsUpdate }) => {
  const mountRef = useRef(null);
  const particlesRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  
  const { recordRenderTime } = usePerformanceMetrics(isRunning, onMetricsUpdate);

  useEffect(() => {
    // Initialize Three.js scene
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(width, height);
    mountRef.current.appendChild(rendererRef.current.domElement);
    
    cameraRef.current.position.z = 30;
    
    // Create particles
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true
    });
    
    particlesRef.current = new THREE.Points(particles, particleMaterial);
    sceneRef.current.add(particlesRef.current);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [particleCount]);
  
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
      
      // Update particle positions for fluid simulation
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += (Math.random() - 0.5) * 0.1;
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
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
  }, [isRunning, particleCount, recordRenderTime]);
  
  return <div ref={mountRef} className="simulation-view" style={{ width: '100%', height: '400px' }} />;
};

export default ThreeJSSimulation;