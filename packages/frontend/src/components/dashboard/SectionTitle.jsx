function SectionTitle({ eyebrow, title, description }) {
  return (
    <header className="section-title">
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  )
}

export default SectionTitle