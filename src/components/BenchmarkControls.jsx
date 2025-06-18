import React, { useState } from 'react';

const BenchmarkControls = ({ onStart, params, onParamsChange, isRunning }) => {
  const [localParams, setLocalParams] = useState(params);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setLocalParams(prev => ({
      ...prev,
      [name]: name === 'particleCount' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onParamsChange(localParams);
    onStart();
  };

  return (
    <div className="benchmark-controls">
      <h2>Configurações do Benchmark</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Número de Partículas:
            <input
              type="range"
              name="particleCount"
              min="100"
              max="10000"
              step="100"
              value={localParams.particleCount}
              onChange={handleParamChange}
            />
            <span>{localParams.particleCount}</span>
          </label>
        </div>
        
        {/* <div className="form-group">
          <label>
            Complexidade:
            <select
              name="complexity"
              value={localParams.complexity}
              onChange={handleParamChange}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </label>
        </div> */}
        
        <button 
          type="submit" 
          disabled={isRunning}
        >
          {isRunning ? 'Executando...' : 'Iniciar Benchmark'}
        </button>
      </form>
    </div>
  );
};

export default BenchmarkControls;