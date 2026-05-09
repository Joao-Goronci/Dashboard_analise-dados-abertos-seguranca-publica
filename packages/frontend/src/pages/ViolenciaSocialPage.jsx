import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import ChartCard from '../components/dashboard/ChartCard.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import SectionTitle from '../components/dashboard/SectionTitle.jsx'
import {
  aggregateMonthlySeries,
  aggregateMunicipalitySeries,
  aggregateProfileSeries,
  aggregateTopNeighborhoods,
  formatCompactNumber,
} from '../utils/dashboardTransforms.js'

const CATEGORY = 'violencia_social'

function ViolenciaSocialPage({ data }) {
  const monthlySeries = aggregateMonthlySeries(data?.crimesPorMes ?? [], CATEGORY)
  const municipalitySeries = aggregateMunicipalitySeries(data?.crimesPorMunicipio ?? [], { category: CATEGORY, limit: 10 })
  const neighborhoodSeries = aggregateTopNeighborhoods(data?.topBairros ?? [], { category: CATEGORY, limit: 10 })
  const genderSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'genero', { category: CATEGORY, limit: 6 })
  const ageSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'faixa_etaria', { category: CATEGORY, limit: 8 })
  const colorSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'cor', { category: CATEGORY, limit: 6 })

  const total = monthlySeries.reduce((sum, item) => sum + item.total, 0)
  const topMunicipio = municipalitySeries[0]?.municipio ?? '-'
  const topBairro = neighborhoodSeries[0]?.bairro ?? '-'
  const topFaixa = ageSeries[0]?.label ?? '-'

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Violência Social"
          title="Perfil territorial e demográfico da violência"
          description="Leitura focada em homicídios e fatores sociais, com visão de tendência, território e perfil de vítimas."
        />
        <div className="dashboard-hero-meta">
          <span>Base: violência social</span>
          <span>Indicadores focados em vítimas e território</span>
        </div>
      </section>

      <section className="kpi-grid">
        <KpiCard label="Total no recorte" value={formatCompactNumber(total)} note="Ocorrências de violência social" />
        <KpiCard label="Município crítico" value={topMunicipio} note="Maior concentração territorial" />
        <KpiCard label="Bairro crítico" value={topBairro} note="Maior recorrência por bairro" />
        <KpiCard label="Faixa etária dominante" value={topFaixa} note="Perfil etário mais presente" />
      </section>

      <section className="chart-grid chart-grid-primary">
        <ChartCard title="Evolução mensal" subtitle="Tendência mensal de violência social">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#111827" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Municípios mais afetados" subtitle="Ranking consolidado da violência social">
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

      <section className="chart-grid chart-grid-secondary">
        <ChartCard title="Perfil por gênero" subtitle="Distribuição registrada no perfil das vítimas">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genderSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#334155" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Perfil por raça/cor" subtitle="Leitura complementar do perfil demográfico">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={colorSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#475569" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="chart-grid chart-grid-full">
        <ChartCard title="Faixas etárias mais recorrentes" subtitle="Distribuição por faixa etária das vítimas">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageSeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  )
}

export default ViolenciaSocialPage
