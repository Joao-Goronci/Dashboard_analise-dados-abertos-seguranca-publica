export function getMonthKey(value) {
  if (!value) return '';
  const asString = String(value);
  const match = asString.match(/^(\d{4})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}`;
  const date = new Date(asString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 7);
}

export function formatMonthLabel(value) {
  if (!value) return '-';
  const monthKey = getMonthKey(value);
  const date = monthKey ? new Date(`${monthKey}-01T00:00:00`) : new Date(value);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' })
    .format(date)
    .replace('.', '')
    .toUpperCase();
}

export function filterByDateRange(rows, startDateStr, endDateStr, dateField = 'data_mes') {
  if (!rows) return [];
  if (!startDateStr && !endDateStr) return rows;
  const start = startDateStr ? new Date(startDateStr) : null;
  const end = endDateStr ? new Date(endDateStr) : null;
  return rows.filter(row => {
    const rowDate = new Date(row[dateField]);
    if (start && rowDate < start) return false;
    if (end && rowDate > end) return false;
    return true;
  });
}

export function filterByMunicipio(rows, municipio) {
  if (!municipio || municipio === 'todos') return rows;
  return rows.filter(row => row.municipio && row.municipio.toLowerCase() === municipio.toLowerCase());
}

export function filterByCategorias(rows, categorias) {
  if (!categorias || categorias.length === 0) return rows;
  return rows.filter(row => categorias.includes(row.categoria_macro));
}

export function getUniqueMunicipios(data, datasetKey = 'crimesPorMunicipio') {
  if (!data || !data[datasetKey]) return [];
  const municipios = data[datasetKey].map(item => item.municipio).filter(Boolean);
  return [...new Set(municipios)].sort();
}

export function getUniqueCategorias(data, datasetKey = 'crimesPorMes') {
  if (!data || !data[datasetKey]) return ['patrimonial', 'violencia_social', 'digital', 'objetos'];
  const categorias = data[datasetKey].map(item => item.categoria_macro).filter(Boolean);
  return [...new Set(categorias)].sort();
}

export function filterByMunicipio(rows, municipio) {
  if (!municipio || !rows) return rows || [];
  return rows.filter(row => row.municipio === municipio);
}

export function filterByCategorias(rows, categorias) {
  if (!categorias || categorias.length === 0 || !rows) return rows || [];
  return rows.filter(row => categorias.includes(row.categoria_macro));
}