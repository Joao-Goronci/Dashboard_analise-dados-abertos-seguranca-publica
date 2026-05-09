function KpiCard({ label, value, note }) {
  const isLongValue = typeof value === 'string' && value.length > 24

  return (
    <article className="kpi-card">
      <span className="kpi-label">{label}</span>
      <strong className={`kpi-value${isLongValue ? ' is-long' : ''}`} title={value}>
        {value}
      </strong>
      {note ? <span className="kpi-note">{note}</span> : null}
    </article>
  )
}

export default KpiCard