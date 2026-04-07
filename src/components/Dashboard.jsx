import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [graficoUrl, setGraficoUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchGrafico = async () => {
      try {
        setLoading(true)
        setError(false)
        
        const response = await fetch('/grafico')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar gráfico')
        }
        
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setGraficoUrl(imageUrl)
      } catch (err) {
        console.error('Erro ao carregar gráfico:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchGrafico()

    // Cleanup: revogar URL do blob quando componente desmontar
    return () => {
      if (graficoUrl) {
        URL.revokeObjectURL(graficoUrl)
      }
    }
  }, [])

  const handleRefresh = () => {
    if (graficoUrl) {
      URL.revokeObjectURL(graficoUrl)
    }
    setGraficoUrl(null)
    setLoading(true)
    setError(false)
    
    fetch('/grafico')
      .then(response => {
        if (!response.ok) throw new Error('Erro')
        return response.blob()
      })
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob)
        setGraficoUrl(imageUrl)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Dados da Seguranca Publica do ES no ano de 2025
        </h1>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </header>

      <main className="dashboard-content">
        {loading && (
          <div className="dashboard-placeholder">
            <div className="loading-spinner"></div>
            <p>Aguardando dados do backend...</p>
          </div>
        )}

        {error && !loading && (
          <div className="dashboard-placeholder error">
            <p>Nao foi possivel carregar os dados.</p>
            <p className="error-hint">Verifique se o backend esta em execucao.</p>
            <button className="retry-button" onClick={handleRefresh}>
              Tentar novamente
            </button>
          </div>
        )}

        {graficoUrl && !loading && !error && (
          <div className="grafico-container">
            <img 
              src={graficoUrl} 
              alt="Gráfico de Segurança Pública ES 2025" 
              className="grafico-image"
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
