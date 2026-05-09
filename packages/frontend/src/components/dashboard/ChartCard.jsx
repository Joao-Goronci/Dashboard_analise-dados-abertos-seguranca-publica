function ChartCard({ title, subtitle, children }) {
  return (
    <section className="chart-card">
      <header className="chart-card-header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>
      <div className="chart-card-body">{children}</div>
    </section>
  )
}

export default ChartCard