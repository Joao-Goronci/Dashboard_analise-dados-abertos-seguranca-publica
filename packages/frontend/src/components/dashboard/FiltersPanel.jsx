import { useState } from 'react';
import ExportPageButton from './ExportPageButton';
import DateRangeSlider from './DateRangeSlider';

function FiltersPanel({ 
  pageRef, 
  pageTitle, 
  pageData, 
  additionalData, 
  dateRange, 
  onDateRangeChange, 
  rawData,
  // Filtros globais
  selectedMunicipio,
  onMunicipioChange,
  selectedCategorias,
  onCategoriasChange,
  availableMunicipios,
  availableCategorias
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('filtros');

  // Conta quantos filtros estão ativos
  const activeFiltersCount = (selectedMunicipio ? 1 : 0) + (selectedCategorias?.length || 0) + (dateRange?.start ? 1 : 0);

  const handleClearFilters = () => {
    onMunicipioChange('');
    onCategoriasChange([]);
    onDateRangeChange({ start: null, end: null });
  };

  return (
    <div className="filters-panel-container">
      <button 
        className="filters-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Filtros ▲' : 'Filtros ▼'}
        {activeFiltersCount > 0 && !isOpen && (
          <span className="filters-badge">{activeFiltersCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="filters-panel">
          <div className="filters-panel-header">
            <div className="filters-tabs">
              <button 
                className={`filters-tab ${activeTab === 'filtros' ? 'active' : ''}`}
                onClick={() => setActiveTab('filtros')}
              >
                🔍 Filtros
              </button>
              <button 
                className={`filters-tab ${activeTab === 'downloads' ? 'active' : ''}`}
                onClick={() => setActiveTab('downloads')}
              >
                📥 Downloads
              </button>
            </div>
            {activeFiltersCount > 0 && (
              <button className="filters-clear" onClick={handleClearFilters}>
                Limpar todos
              </button>
            )}
          </div>

          <div className="filters-panel-content">
            {activeTab === 'filtros' && (
              <div className="filters-section">
                {/* Período */}
                <div className="filter-group full-width">
                  <DateRangeSlider 
                    data={rawData?.crimesPorMes || []}
                    onRangeChange={onDateRangeChange}
                    value={dateRange}
                  />
                </div>

                {/* Município */}
                <div className="filter-group">
                  <label>📍 Município</label>
                  <select 
                    value={selectedMunicipio} 
                    onChange={(e) => onMunicipioChange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos os municípios</option>
                    {availableMunicipios?.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Categorias (multi-select em grid) */}
                <div className="filter-group">
                  <label>📂 Categorias</label>
                  <div className="checkbox-group">
                    {availableCategorias?.map(cat => (
                      <label key={cat} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedCategorias?.includes(cat)}
                          onChange={() => {
                            if (selectedCategorias.includes(cat)) {
                              onCategoriasChange(selectedCategorias.filter(c => c !== cat));
                            } else {
                              onCategoriasChange([...selectedCategorias, cat]);
                            }
                          }}
                        />
                        {cat === 'patrimonial' && 'Patrimonial'}
                        {cat === 'violencia_social' && 'Violência Social'}
                        {cat === 'digital' && 'Digital'}
                        {cat === 'objetos' && 'Objetos'}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Indicador de resumo */}
                {activeFiltersCount > 0 && (
                  <div className="filter-summary">
                    <strong>Filtros ativos:</strong> {activeFiltersCount}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="downloads-section">
                <ExportPageButton 
                  pageRef={pageRef}
                  pageTitle={pageTitle}
                  pageData={pageData}
                  additionalData={additionalData}
                  compact={false}
                />
                <p className="downloads-hint">
                  PNG: captura a página inteira<br />
                  CSV: exporta todos os dados brutos
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FiltersPanel;