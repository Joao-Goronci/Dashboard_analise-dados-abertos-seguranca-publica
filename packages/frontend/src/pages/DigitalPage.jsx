import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import ChartCard from '../components/dashboard/ChartCard.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import SectionTitle from '../components/dashboard/SectionTitle.jsx'
import {
  aggregateMonthlySeries,
  aggregateMunicipalitySeries,
  formatCompactNumber,
} from '../utils/dashboardTransforms.js'

const CATEGORY = 'digital'

function DigitalPage({ data }) {
  const monthlySeries = aggregateMonthlySeries(data?.crimesPorMes ?? [], CATEGORY)
  const municipalitySeries = aggregateMunicipalitySeries(data?.crimesDigitaisEvolucao ?? [], { limit: 10 })

  const total = monthlySeries.reduce((sum, item) => sum + item.total, 0)
  const topMunicipio = municipalitySeries[0]?.municipio ?? '-'
  const peakMonth = monthlySeries.reduce(
    (currentPeak, item) => (item.total > (currentPeak?.total ?? 0) ? item : currentPeak),
    monthlySeries[0],
  )
  const avgMonthly = monthlySeries.length ? Math.round(total / monthlySeries.length) : 0

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Digital"
          title="Crimes digitais e sua evolução"
          description="Acompanhe o comportamento das ocorrências digitais por mês e município, com leitura rápida dos pontos críticos."
        />
        <div className="dashboard-hero-meta">
          <span>Base: crimes digitais</span>
          <span>Evolução e concentração territorial</span>
        </div>
      </section>

      <section className="kpi-grid">
        <KpiCard label="Total digital" value={formatCompactNumber(total)} note="Ocorrências da categoria" />
        <KpiCard label="Município crítico" value={topMunicipio} note="Maior incidência digital" />
        <KpiCard label="Mês de pico" value={peakMonth ? peakMonth.mes : '-'} note="Maior valor mensal" />
        <KpiCard label="Média mensal" value={formatCompactNumber(avgMonthly)} note="Média simples do período" />
      </section>

      <section className="chart-grid chart-grid-primary">
        <ChartCard title="Evolução mensal digital" subtitle="Tendência dos crimes digitais ao longo do período">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Municípios com maior volume digital" subtitle="Top 10 recortes territoriais">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={municipalitySeries} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis type="category" dataKey="municipio" width={130} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#111827" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="chart-grid chart-grid-full">
        <ChartCard title="Mês de maior pressão" subtitle="Último ponto de maior volume digital no período">
          <div className="dashboard-placeholder">
            <div>
              <strong>{peakMonth ? peakMonth.mes : '-'}</strong>
              <p>{peakMonth ? formatCompactNumber(peakMonth.total) : '0'} ocorrências</p>
            </div>
            <p className="error-hint">Dados consolidados a partir da série mensal digital.</p>
          </div>
        </ChartCard>
      </section>
    </div>
  )
}

export default DigitalPage
