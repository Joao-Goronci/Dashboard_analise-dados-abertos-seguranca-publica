// src/App.jsx
import { useEffect, useMemo, useState, useRef } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import DigitalPage from './pages/DigitalPage.jsx';
import ObjetosPage from './pages/ObjetosPage.jsx';
import PatrimonialPage from './pages/PatrimonialPage.jsx';
import ViolenciaSocialPage from './pages/ViolenciaSocialPage.jsx';
import FiltersPanel from './components/dashboard/FiltersPanel.jsx';
import { filterByDateRange } from './utils/dashboardFilters.js';
import './App.css';

const API_URL = '/api/dashboard';
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'violencia-social', label: 'Violência Social' },
  { id: 'patrimonial', label: 'Patrimonial' },
  { id: 'digital', label: 'Digital' },
  { id: 'objetos', label: 'Objetos' },
];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const pageRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const payload = await response.json();
        setRawData(payload);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error(fetchError);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
    return () => controller.abort();
  }, []);

  // Dados filtrados por intervalo de datas
  const filteredData = useMemo(() => {
    if (!rawData) return null;
    if (!dateRange.start && !dateRange.end) return rawData;

    const applyFilter = (series) => filterByDateRange(series, dateRange.start, dateRange.end, 'data_mes');
    
    return {
      ...rawData,
      crimesPorMes: applyFilter(rawData.crimesPorMes),
      comparativoFurtoRoubo: applyFilter(rawData.comparativoFurtoRoubo),
      crimesDigitaisEvolucao: applyFilter(rawData.crimesDigitaisEvolucao),
      // outros datasets que possuam data_mes podem ser adicionados
    };
  }, [rawData, dateRange]);

  // Dados adicionais para exportação (usando rawData completo ou filtrado? Usaremos rawData para ter tudo)
  const exportAdditionalData = useMemo(() => {
    if (!rawData) return {};
    return {
      crimesPorMes: rawData.crimesPorMes,
      crimesPorMunicipio: rawData.crimesPorMunicipio,
      topBairros: rawData.topBairros,
      objetosMaisRoubados: rawData.objetosMaisRoubados,
      perfilVitimas: rawData.perfilVitimas,
    };
  }, [rawData]);

  const pageTitle = NAV_ITEMS.find(item => item.id === activePage)?.label || 'Dashboard';

  const activeView = useMemo(() => {
    const views = {
      home: <Dashboard data={filteredData} loading={loading} error={error} />,
      'violencia-social': <ViolenciaSocialPage data={filteredData} />,
      patrimonial: <PatrimonialPage data={filteredData} />,
      digital: <DigitalPage data={filteredData} />,
      objetos: <ObjetosPage data={filteredData} />,
    };
    const PageComponent = views[activePage] ?? views.home;
    return <div ref={pageRef} className="page-export-container">{PageComponent}</div>;
  }, [activePage, filteredData, loading, error]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <p className="app-kicker">Segurança pública ES 2025</p>
          <h1>Dashboard analítico interativo</h1>
          <p className="app-description">
            Dados publicos de segurança do Espírito Santo.
          </p>
        </div>
        <div className="header-controls">
          <nav className="app-nav" aria-label="Seções do dashboard">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`app-nav-button${activePage === item.id ? ' active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <FiltersPanel 
            pageRef={pageRef}
            pageTitle={pageTitle}
            pageData={filteredData} 
            additionalData={exportAdditionalData}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            rawData={rawData} 
          />
        </div>
      </header>
      <main className="dashboard-section">{activeView}</main>
    </div>
  );
}

export default App;