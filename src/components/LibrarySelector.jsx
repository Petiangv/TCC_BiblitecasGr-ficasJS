import React from 'react';

const libraries = [
  { id: 'threejs', name: 'Three.js' },
  { id: 'd3js', name: 'D3.js' },
  { id: 'pixi', name: 'Pixi.js' },
  { id: 'p5', name: 'p5.js' }
];

const LibrarySelector = ({ selectedLibraries, onSelect }) => {
  return (
    <div className="library-selector">
      <h2>Selecione a Bibliotecas para Comparar</h2>
      <div className="library-buttons">
        {libraries.map(library => (
          <button
            key={library.id}
            onClick={() => onSelect(library.id)}
            className={selectedLibraries.includes(library.id) ? 'selected' : ''}
          >
            {library.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LibrarySelector;
