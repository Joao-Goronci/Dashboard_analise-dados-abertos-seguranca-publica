import { useState, useEffect } from 'react';

function GlobalFilters({ availableMunicipios, availableCategorias, onFilterChange, initialFilters = {} }) {
  const [municipio, setMunicipio] = useState(initialFilters.municipio || '');
  const [categorias, setCategorias] = useState(initialFilters.categorias || []);

  useEffect(() => {
    onFilterChange({ municipio, categorias });
  }, [municipio, categorias, onFilterChange]);

  const toggleCategoria = (cat) => {
    setCategorias(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="global-filters">
      <div className="filter-group">
        <label>📍 Município:</label>
        <select value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
          <option value="">Todos</option>
          {availableMunicipios.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>🏷️ Categorias:</label>
        <div className="category-buttons">
          {availableCategorias.map(cat => {
            let label = cat;
            if (cat === 'patrimonial') label = 'Patrimonial';
            if (cat === 'violencia_social') label = 'Violência Social';
            if (cat === 'digital') label = 'Digital';
            if (cat === 'objetos') label = 'Objetos';
            return (
              <button
                key={cat}
                type="button"
                className={`category-btn ${categorias.includes(cat) ? 'active' : ''}`}
                onClick={() => toggleCategoria(cat)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GlobalFilters;