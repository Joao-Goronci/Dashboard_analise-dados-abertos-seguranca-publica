import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import ChartCard from '../components/dashboard/ChartCard.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import SectionTitle from '../components/dashboard/SectionTitle.jsx'
import './Dashboard.css'

const API_URL = '/api/dashboard'

const CATEGORY_COLORS = {
  patrimonial: '#111827',
  violencia_social: '#475569',
  digital: '#2563eb',
}

const PERIOD_COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8']
const CATEGORY_LABELS = {
  patrimonial: 'Patrimonial',
  violencia_social: 'Violência social',
  digital: 'Digital',
}

function getMonthKey(value) {
  if (!value) return ''

  const asString = String(value)
  const match = asString.match(/^(\d{4})-(\d{2})/)
  if (match) return `${match[1]}-${match[2]}`

  const date = new Date(asString)
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 7)
}

function formatMonthLabel(value) {
  if (!value) return '-'

  const monthKey = getMonthKey(value)
  const date = monthKey ? new Date(`${monthKey}-01T00:00:00`) : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' })
    .format(date)
    .replace('.', '')
    .toUpperCase()
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(Number(value) || 0)
}

function buildMonthlySeries(rows) {
  const grouped = new Map()

  rows.forEach((row) => {
    const monthKey = getMonthKey(row.data_mes)
    if (!monthKey) return

    const month = formatMonthLabel(monthKey)
    const current = grouped.get(monthKey) ?? { monthKey, mes: month, total: 0 }
    current.total += Number(row.quantidade) || 0
    grouped.set(monthKey, current)
  })

  return Array.from(grouped.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey))
}

function buildCategorySeries(rows) {
  const grouped = new Map()

  rows.forEach((row) => {
    const monthKey = getMonthKey(row.data_mes)
    if (!monthKey) return

    const month = formatMonthLabel(monthKey)
    const current = grouped.get(monthKey) ?? {
      monthKey,
      mes: month,
      patrimonial: 0,
      violencia_social: 0,
      digital: 0,
    }

    const category = row.categoria_macro
    if (category in current) {
      current[category] += Number(row.quantidade) || 0
    }

    grouped.set(monthKey, current)
  })

  return Array.from(grouped.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey))
}

function Dashboard() {
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

  const kpis = useMemo(() => {
    if (!data?.kpisHome) return []

    return [
      {
        label: 'Total de Ocorrências',
        value: formatCompactNumber(data.kpisHome.total_crimes),
        note: 'Todos os datasets consolidados',
      },
      {
        label: 'Município Crítico',
        value: data.kpisHome.cidade_critica ?? '-',
        note: 'Maior volume no período',
      },
      {
        label: 'Período Crítico',
        value: data.kpisHome.horario_critico ?? '-',
        note: 'Faixa do dia mais recorrente',
      },
      {
        label: 'Crime Dominante',
        value: data.kpisHome.crime_dominante ?? '-',
        note: 'Modalidade mais frequente',
      },
    ]
  }, [data])

  const monthlySeries = useMemo(() => buildMonthlySeries(data?.crimesPorMes ?? []), [data])
  const categorySeries = useMemo(() => buildCategorySeries(data?.crimesPorMes ?? []), [data])
  const municipalitySeries = useMemo(
    () => (data?.crimesPorMunicipio ?? []).slice(0, 10),
    [data],
  )
  const periodSeries = useMemo(
    () => (data?.crimesPorPeriodo ?? []).map((item) => ({ ...item })),
    [data],
  )
  const topNeighborhoods = useMemo(
    () => (data?.topBairros ?? []).slice(0, 10),
    [data],
  )

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Segurança pública ES 2025"
          title="Dashboard analítico de ocorrências"
          description="KPIs e gráficos baseados nos dados processados para apoiar leitura territorial, temporal e operacional."
        />
        <div className="dashboard-hero-meta">
          <span>Fonte: dados públicos processados</span>
          <span>Recorte: jan-out/2025</span>
        </div>
      </section>

      {loading ? (
        <div className="dashboard-placeholder">
          <div className="loading-spinner" />
          <p>Carregando dados analíticos...</p>
        </div>
      ) : null}

      {error && !loading ? (
        <div className="dashboard-placeholder error">
          <p>Não foi possível carregar os dados do backend.</p>
          <p className="error-hint">Verifique se a API FastAPI está em execução.</p>
        </div>
      ) : null}

      {!loading && !error && data ? (
        <>
          <section className="kpi-grid">
            {kpis.map((item) => (
              <KpiCard key={item.label} {...item} />
            ))}
          </section>

          <section className="chart-grid chart-grid-primary">
            <ChartCard
              title="Evolução mensal das ocorrências"
              subtitle="Todos os meses disponíveis são exibidos na ordem cronológica"
            >
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="mes"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={58}
                    tickMargin={12}
                    tick={{ fill: '#475569', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(label) => `Mês: ${label}`}
                    formatter={(value) => [formatCompactNumber(value), 'Ocorrências']}
                  />
                  <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Crimes por município"
              subtitle="Ranking dos 10 municípios com maior volume de ocorrências"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={municipalitySeries}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="municipio"
                    width={130}
                    tick={{ fill: '#475569', fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
                  <Bar dataKey="quantidade" fill="#111827" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section className="chart-grid chart-grid-secondary">
            <ChartCard
              title="Distribuição por período do dia"
              subtitle="Horários com maior concentração de registros"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={periodSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="periodo_dia"
                    interval={0}
                    tickMargin={12}
                    tick={{ fill: '#475569', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
                  <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                    {periodSeries.map((entry, index) => (
                      <Cell key={`cell-${entry.periodo_dia}`} fill={PERIOD_COLORS[index % PERIOD_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Top bairros"
              subtitle="Bairros com maior concentração de registros"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={topNeighborhoods}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="bairro"
                    width={130}
                    tick={{ fill: '#475569', fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
                  <Bar dataKey="quantidade" fill="#334155" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section className="chart-grid chart-grid-full">
            <ChartCard
              title="Evolução por categoria macro"
              subtitle="Comparativo por categoria, com cores fixas e legenda mais clara"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categorySeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="mes"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={58}
                    tickMargin={12}
                    tick={{ fill: '#475569', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [formatCompactNumber(value), CATEGORY_LABELS[name] ?? name]}
                  />
                  <Legend formatter={(value) => CATEGORY_LABELS[value] ?? value} />
                  <Bar dataKey="patrimonial" stackId="a" fill={CATEGORY_COLORS.patrimonial} />
                  <Bar dataKey="violencia_social" stackId="a" fill={CATEGORY_COLORS.violencia_social} />
                  <Bar dataKey="digital" stackId="a" fill={CATEGORY_COLORS.digital} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default Dashboard
