import React, { useState } from 'react';
import BenchmarkControls from './components/BenchmarkControls';
import LibrarySelector from './components/LibrarySelector';
import PerformanceMetrics from './components/PerformanceMetrics';
import ThreeJSSimulation from './components/FluidSimulation/ThreeJSSimulation';
import D3JSSimulation from './components/FluidSimulation/D3JSSimulation';
import PixiJSSimulation from './components/FluidSimulation/PixiJSSimulation.jsx';

const App = () => {
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [simulationParams, setSimulationParams] = useState({
    particleCount: 1000,
    //complexity: 'medium'
  });

  const handleStartBenchmark = () => {
    setIsRunning(true);
    setMetrics({});
  };

  const handleLibrarySelect = (library) => {
    setSelectedLibraries(prev => 
      prev.includes(library) 
        ? prev.filter(lib => lib !== library) 
        : [...prev, library]
    );
  };

  const updateMetrics = (library, data) => {
    setMetrics(prev => ({
      ...prev,
      [library]: data
    }));
  };

  const renderSimulation = (library) => {
    const commonProps = {
      particleCount: simulationParams.particleCount,
      onMetricsUpdate: (data) => updateMetrics(library, data),
      isRunning
    };

    switch(library) {
      case 'threejs':
        return <ThreeJSSimulation key="threejs" {...commonProps} />;
      case 'd3js':
        return <D3JSSimulation key="d3js" {...commonProps} />;

        case 'pixi':
        return <PixiJSSimulation key="pixi" {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <h1>Comparador de Bibliotecas Gráficas</h1>
      <p>Simulação de Fluidos como Benchmark</p>
      
      <LibrarySelector 
        selectedLibraries={selectedLibraries}
        onSelect={handleLibrarySelect}
      />
      
      <BenchmarkControls 
        onStart={handleStartBenchmark}
        params={simulationParams}
        onParamsChange={setSimulationParams}
        isRunning={isRunning}
      />
      
      <div className="simulations-container">
        {selectedLibraries.map(library => (
          <div key={library} className="simulation-wrapper">
            <h2>{library.toUpperCase()}</h2>
            {renderSimulation(library)}
          </div>
        ))}
      </div>
      
      <PerformanceMetrics metrics={metrics} />
    </div>
  );
};

export default App;
