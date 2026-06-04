import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getMonthKey, formatMonthLabel } from '../../utils/dashboardFilters';

function DateRangeSlider({ data, onRangeChange, value }) {
  if (!data || data.length === 0) {
    return <div className="date-range-slider-empty">Nenhum dado mensal disponível</div>;
  }

  // Extrair meses únicos ordenados
  const months = [...new Set(data.map(item => getMonthKey(item.data_mes)))].sort();
  const monthLabels = months.map(m => formatMonthLabel(m));

  // Marcar apenas alguns pontos para não poluir
  const marks = {};
  months.forEach((_, idx) => {
    if (idx === 0 || idx === months.length - 1 || idx % 3 === 0) {
      marks[idx] = monthLabels[idx];
    }
  });

  const handleChange = (newRange) => {
    const startMonth = months[newRange[0]];
    const endMonth = months[newRange[1]];
    onRangeChange({ start: startMonth, end: endMonth });
  };

  const defaultValue = [0, months.length - 1];
  const currentValue = value && value.start && value.end
    ? [months.indexOf(value.start), months.indexOf(value.end)]
    : defaultValue;

  return (
    <div className="date-range-slider">
      <label>📅 Período de análise:</label>
      <Slider
        range
        min={0}
        max={months.length - 1}
        defaultValue={defaultValue}
        onChange={handleChange}
        marks={marks}
        step={1}
        value={currentValue}
        trackStyle={[{ backgroundColor: '#0f172a' }]}
        handleStyle={[{ borderColor: '#0f172a', backgroundColor: '#0f172a' }]}
        railStyle={{ backgroundColor: '#e2e8f0' }}
      />
      <div className="date-range-hint">
        {value?.start && value?.end ? (
          <strong>{formatMonthLabel(value.start)} a {formatMonthLabel(value.end)}</strong>
        ) : (
          <span>Todo o período disponível</span>
        )}
      </div>
    </div>
  );
}

export default DateRangeSlider;