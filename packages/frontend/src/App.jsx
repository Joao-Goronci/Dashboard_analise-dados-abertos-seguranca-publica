import { useEffect, useMemo, useState } from 'react'

import Dashboard from './pages/Dashboard.jsx'
import DigitalPage from './pages/DigitalPage.jsx'
import ObjetosPage from './pages/ObjetosPage.jsx'
import PatrimonialPage from './pages/PatrimonialPage.jsx'
import ViolenciaSocialPage from './pages/ViolenciaSocialPage.jsx'
import './App.css'

const API_URL = '/api/dashboard'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'violencia-social', label: 'Violência Social' },
  { id: 'patrimonial', label: 'Patrimonial' },
  { id: 'digital', label: 'Digital' },
  { id: 'objetos', label: 'Objetos' },
]

function App() {
  const [activePage, setActivePage] = useState('home')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do dashboard')
        }

        const payload = await response.json()
        setData(payload)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error(fetchError)
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
    return () => controller.abort()
  }, [])

  const activeView = useMemo(() => {
    const views = {
      home: <Dashboard data={data} loading={loading} error={error} />,
      'violencia-social': <ViolenciaSocialPage data={data} />,
      patrimonial: <PatrimonialPage data={data} />,
      digital: <DigitalPage data={data} />,
      objetos: <ObjetosPage data={data} />,
    }

    return views[activePage] ?? views.home
  }, [activePage, data, error, loading])

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <p className="app-kicker">Segurança pública ES 2025</p>
          <h1>Dashboard analítico interativo</h1>
          <p className="app-description">
            Navegue entre Home, Violência Social, Patrimonial, Digital e Objetos para explorar os dados consolidados.
          </p>
        </div>

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
      </header>

      <main className="dashboard-section">{activeView}</main>
    </div>
  )
}

export default App
