import { useEffect, useRef } from 'react';

const usePerformanceMetrics = (isRunning, onUpdate) => {
  const fpsRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef();
  const metricsRef = useRef({
    fps: 0,
    memory: 0,
    renderTime: 0
  });

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const measurePerformance = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      // Calculate FPS every second
      if (now >= lastTimeRef.current + 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        
        // Get memory usage if available
        const memoryUsage = performance.memory ? 
          performance.memory.usedJSHeapSize / 1024 / 1024 : 0;
        
        metricsRef.current = {
          fps: fpsRef.current,
          memory: memoryUsage,
          renderTime: metricsRef.current.renderTime
        };
        
        onUpdate(metricsRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };
    
    animationFrameRef.current = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, onUpdate]);

  const recordRenderTime = (startTime) => {
    const renderTime = performance.now() - startTime;
    metricsRef.current.renderTime = renderTime;
    onUpdate(metricsRef.current);
    return renderTime;
  };

  return { recordRenderTime };
};

export default usePerformanceMetrics;