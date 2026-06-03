import { Bar, BarChart, Cell, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
const GENDER_COLORS = ['#111827', '#64748b']
const RACE_COLORS = ['#111827', '#334155', '#475569', '#64748b']

function ViolenciaSocialPage({ data }) {
  const monthlySeries = aggregateMonthlySeries(data?.crimesPorMes ?? [], CATEGORY)
  const municipalitySeries = aggregateMunicipalitySeries(data?.crimesPorMunicipio ?? [], { category: CATEGORY, limit: 10 })
  const neighborhoodSeries = aggregateTopNeighborhoods(data?.topBairros ?? [], { category: CATEGORY, limit: 10 })

  // Corrigido para usar campos corretos com dados: 'sexo' (gênero das vítimas) e 'cutis' (raça/cor das vítimas)
  const genderSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'sexo', { category: CATEGORY, limit: 6 })
  const ageSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'faixa_etaria', { category: CATEGORY, limit: 8 })
  const raceSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'cutis', { category: CATEGORY, limit: 6 })

  const total = monthlySeries.reduce((sum, item) => sum + item.total, 0)
  const topMunicipio = municipalitySeries[0]?.municipio ?? '-'
  const topBairro = neighborhoodSeries[0]?.bairro ?? '-'
  const topFaixa = ageSeries[0]?.label ?? '-'

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Violência Social"
          title="Perfil de vítimas e distribuição geográfica"
          description="Análise focada em homicídios com perfil detalhado das vítimas (gênero, raça/cor, faixa etária) e distribuição territorial para compreensão de fatores sociais."
        />
        <div className="dashboard-hero-meta">
          <span>Base: vítimas de violência social</span>
          <span>Período: janeiro a outubro de 2025</span>
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
        <ChartCard title="Perfil por gênero das vítimas" subtitle="Distribuição de gênero das vítimas de violência social">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <Pie
                data={genderSeries}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ label, quantidade }) => `${label}: ${formatCompactNumber(quantidade)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {genderSeries.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Vítimas']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Perfil por raça/cor das vítimas" subtitle="Distribuição de raça/cor das vítimas (dados demográficos)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={raceSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Vítimas']} />
              <Bar dataKey="quantidade" fill="#475569" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="chart-grid chart-grid-full">
        <ChartCard title="Faixas etárias mais recorrentes das vítimas" subtitle="Distribuição por faixa etária das vítimas de violência social">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageSeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Vítimas']} />
              <Bar dataKey="quantidade" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  )
}

export default ViolenciaSocialPage
