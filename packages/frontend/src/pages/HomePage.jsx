import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import ChartCard from '../components/dashboard/ChartCard.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import SectionTitle from '../components/dashboard/SectionTitle.jsx'
import { COLORS } from '../utils/theme';
import {
  aggregateCategoryMonthlySeries,
  aggregateMunicipalitySeries,
  aggregatePeriodSeries,
  aggregateTopNeighborhoods,
  formatCompactNumber,
} from '../utils/dashboardTransforms.js'

const CATEGORY_COLORS = {
  patrimonial: COLORS.patrimonial,
  violencia_social: COLORS.violencia_social,
  digital: COLORS.digital,
  objetos: COLORS.objetos,
};

const CATEGORY_LABELS = {
  patrimonial: 'Patrimonial',
  violencia_social: 'Violência social',
  digital: 'Digital',
  objetos: 'Objetos',
};

function HomePage({ data }) {
  const monthlySeries = aggregateCategoryMonthlySeries(data?.crimesPorMes ?? [])
  const municipalitySeries = aggregateMunicipalitySeries(data?.crimesPorMunicipio ?? [], { limit: 10 })
  const periodSeries = aggregatePeriodSeries(data?.crimesPorPeriodo ?? [])
  const topNeighborhoods = aggregateTopNeighborhoods(data?.topBairros ?? [], { limit: 10 })

  const kpis = [
    {
      label: 'Total de Ocorrências',
      value: formatCompactNumber(data?.kpisHome?.total_crimes),
      note: 'Base consolidada do período',
    },
    {
      label: 'Município Crítico',
      value: data?.kpisHome?.cidade_critica ?? '-',
      note: 'Maior volume acumulado',
    },
    {
      label: 'Período Crítico',
      value: data?.kpisHome?.horario_critico ?? '-',
      note: `Horário informado em ${data?.kpisHome?.percentual_com_horario ?? 0}% dos registros`,
    },
    {
      label: 'Crime Dominante',
      value: data?.kpisHome?.crime_dominante ?? '-',
      note: 'Modalidade mais frequente',
    },
  ]

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Home"
          title="Dashboard analítico de segurança pública"
          description="A visão geral agora é interativa, consolidada e organizada para leitura executiva do cenário do ES em 2025."
        />
        <div className="dashboard-hero-meta">
          <span>Fonte: dados públicos processados</span>
          <span>Recorte: jan-out/2025</span>
        </div>
      </section>

      <section className="kpi-grid">
        {kpis.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </section>

      <section className="chart-grid chart-grid-primary">
        <ChartCard title="Evolução mensal das ocorrências" subtitle="Todos os meses aparecem em ordem cronológica">
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
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Line type="monotone" dataKey="patrimonial" name={CATEGORY_LABELS.patrimonial} stroke={CATEGORY_COLORS.patrimonial} strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="violencia_social" name={CATEGORY_LABELS.violencia_social} stroke={CATEGORY_COLORS.violencia_social} strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="digital" name={CATEGORY_LABELS.digital} stroke={CATEGORY_COLORS.digital} strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="objetos" name={CATEGORY_LABELS.objetos} stroke={CATEGORY_COLORS.objetos} strokeWidth={3} dot={{ r: 3 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crimes por município" subtitle="Ranking consolidado por município, sem duplicações">
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

      <section className="chart-grid chart-grid-secondary">
        <ChartCard title="Distribuição por período do dia" subtitle="Uma barra por período, com as categorias empilhadas e a ausência de horário explícita">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={periodSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="periodo_dia"
                tick={{ fill: '#475569', fontSize: 12 }}
                tickFormatter={(value) => (value === 'SEM_HORARIO_INFORMADO' ? 'SEM HORÁRIO' : value)}
              />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Legend />
              <Bar dataKey="patrimonial" stackId="a" fill={CATEGORY_COLORS.patrimonial} />
              <Bar dataKey="violencia_social" stackId="a" fill={CATEGORY_COLORS.violencia_social} />
              <Bar dataKey="digital" stackId="a" fill={CATEGORY_COLORS.digital} />
              <Bar dataKey="objetos" stackId="a" fill={CATEGORY_COLORS.objetos} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top bairros" subtitle="Bairros mais recorrentes no recorte atual">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topNeighborhoods} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis type="category" dataKey="bairro" width={130} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar dataKey="quantidade" fill="#334155" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  )
}

export default HomePage
