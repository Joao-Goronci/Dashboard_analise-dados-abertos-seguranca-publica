import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import ChartCard from '../components/dashboard/ChartCard.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import SectionTitle from '../components/dashboard/SectionTitle.jsx'
import {
  aggregateComparisonSeries,
  aggregateMonthlySeries,
  aggregateMunicipalitySeries,
  aggregateTopNeighborhoods,
  formatCompactNumber,
} from '../utils/dashboardTransforms.js'

const CATEGORY = 'patrimonial'

function PatrimonialPage({ data }) {
  const monthlySeries = aggregateMonthlySeries(data?.crimesPorMes ?? [], CATEGORY)
  const municipalitySeries = aggregateMunicipalitySeries(data?.crimesPorMunicipio ?? [], { category: CATEGORY, limit: 10 })
  const neighborhoodSeries = aggregateTopNeighborhoods(data?.topBairros ?? [], { category: CATEGORY, limit: 10 })
  const comparisonSeries = aggregateComparisonSeries(data?.comparativoFurtoRoubo ?? [])

  const total = monthlySeries.reduce((sum, item) => sum + item.total, 0)
  const topMunicipio = municipalitySeries[0]?.municipio ?? '-'
  const topBairro = neighborhoodSeries[0]?.bairro ?? '-'
  const topMonth = monthlySeries.at(-1)?.mes ?? '-'

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Patrimonial"
          title="Leitura de furtos e roubos"
          description="Painel para entender a dinâmica patrimonial com foco em tendência, território e comparação furtos vs roubos."
        />
        <div className="dashboard-hero-meta">
          <span>Base: crimes contra o patrimônio</span>
          <span>Comparativo mensal entre furtos e roubos</span>
        </div>
      </section>

      <section className="kpi-grid">
        <KpiCard label="Total patrimonial" value={formatCompactNumber(total)} note="Ocorrências da categoria" />
        <KpiCard label="Município crítico" value={topMunicipio} note="Maior volume acumulado" />
        <KpiCard label="Bairro crítico" value={topBairro} note="Maior recorrência no recorte" />
        <KpiCard label="Mês mais recente" value={topMonth} note="Último mês disponível no painel" />
      </section>

      <section className="chart-grid chart-grid-primary">
        <ChartCard title="Furtos x roubos" subtitle="Comparativo mensal das duas submodalidades">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={comparisonSeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Legend />
              <Bar dataKey="furtos" fill="#111827" radius={[8, 8, 0, 0]} />
              <Bar dataKey="roubos" fill="#475569" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Municípios patrimoniais" subtitle="Ranking consolidado da categoria patrimonial">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={municipalitySeries} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis type="category" dataKey="municipio" width={130} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#0f172a" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="chart-grid chart-grid-full">
        <ChartCard title="Bairros patrimoniais mais recorrentes" subtitle="Recorte com maior concentração em bairros">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={neighborhoodSeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="bairro" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#334155" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  )
}

export default PatrimonialPage
