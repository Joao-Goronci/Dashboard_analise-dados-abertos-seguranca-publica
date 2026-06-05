import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../components/dashboard/ChartCard.jsx';
import KpiCard from '../components/dashboard/KpiCard.jsx';
import SectionTitle from '../components/dashboard/SectionTitle.jsx';
import {
  aggregateMonthlySeries,
  aggregateMunicipalitySeries,
  aggregateProfileSeries,
  aggregateTopNeighborhoods,
  formatCompactNumber,
} from '../utils/dashboardTransforms.js';

const CATEGORY = 'violencia_social';

function ViolenciaSocialPage({ data, onMunicipioClick }) {
  const monthlySeries = aggregateMonthlySeries(data?.crimesPorMes ?? [], CATEGORY);
  const municipalitySeries = aggregateMunicipalitySeries(data?.crimesPorMunicipio ?? [], { category: CATEGORY, limit: 10 });
  const neighborhoodSeries = aggregateTopNeighborhoods(data?.topBairros ?? [], { category: CATEGORY, limit: 10 });
  const genderSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'sexo', { category: CATEGORY, limit: 6 });
  const ageSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'faixa_etaria', { category: CATEGORY, limit: 8 });
  const raceSeries = aggregateProfileSeries(data?.perfilVitimas ?? [], 'cutis', { category: CATEGORY, limit: 6 });

  const total = monthlySeries.reduce((sum, item) => sum + item.total, 0);
  const topMunicipio = municipalitySeries[0]?.municipio ?? '-';
  const topBairro = neighborhoodSeries[0]?.bairro ?? '-';
  const topFaixa = ageSeries[0]?.label ?? '-';

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <SectionTitle
          eyebrow="Violência Social"
          title="Perfil de vítimas e distribuição geográfica"
          description="Análise focada em homicídios com perfil detalhado das vítimas (gênero, raça/cor, faixa etária) e distribuição territorial."
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
              <Line type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Municípios mais afetados" subtitle="Ranking consolidado da violência social. Clique em uma barra para filtrar.">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={municipalitySeries} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis type="category" dataKey="municipio" width={130} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Ocorrências']} />
              <Bar
                dataKey="quantidade"
                fill="#0f172a"
                radius={[0, 8, 8, 0]}
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.payload && data.payload.municipio && onMunicipioClick) {
                    onMunicipioClick(data.payload.municipio);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="chart-grid chart-grid-secondary">
        <ChartCard title="Perfil por gênero das vítimas" subtitle="Distribuição de gênero (barras horizontais)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genderSeries} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis type="category" dataKey="label" width={100} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Vítimas']} />
              <Bar dataKey="quantidade" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Perfil por raça/cor das vítimas" subtitle="Distribuição de raça/cor (barras horizontais)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={raceSeries} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis type="category" dataKey="label" width={100} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCompactNumber(value), 'Vítimas']} />
              <Bar dataKey="quantidade" fill="#475569" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="chart-grid chart-grid-full">
        <ChartCard title="Faixas etárias mais recorrentes das vítimas" subtitle="Distribuição por faixa etária das vítimas">
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
  );
}

export default ViolenciaSocialPage;