import { useState } from 'react';
import ExportPageButton from './ExportPageButton';
import DateRangeSlider from './DateRangeSlider';

function FiltersPanel({ pageRef, pageTitle, pageData, additionalData, dateRange, onDateRangeChange, rawData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filters-panel-container">
      <button 
        className="filters-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Filtros ▲' : 'Filtros ▼'}
      </button>
      {isOpen && (
        <div className="filters-panel">
          <div className="filters-section">
            <h4>🔍 Filtros</h4>
            {/* Controle de intervalo de datas */}
            <DateRangeSlider 
              data={rawData?.crimesPorMes || []}
              onRangeChange={onDateRangeChange}
              value={dateRange}
            />
            {/* Aqui serão adicionados outros filtros futuramente */}
            <div className="filters-placeholder">
              Em breve: filtros por município, categoria, etc.
            </div>
          </div>
          <div className="downloads-section">
            <h4>📥 Downloads</h4>
            <ExportPageButton 
              pageRef={pageRef}
              pageTitle={pageTitle}
              pageData={pageData}
              additionalData={additionalData}
              compact={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FiltersPanel;