import { useMemo } from 'react'

import './Dashboard.css'

import HomePage from './HomePage.jsx'

function Dashboard({ data, loading, error }) {
  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="dashboard-placeholder">
          <div className="loading-spinner" />
          <p>Carregando dados analíticos...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="dashboard-placeholder error">
          <p>Não foi possível carregar os dados do backend.</p>
          <p className="error-hint">Verifique se a API FastAPI está em execução.</p>
        </div>
      )
    }

    if (!data) return null

    return <HomePage data={data} />
  }, [data, error, loading])

  return <>{content}</>
}

export default Dashboard
