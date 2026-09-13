const STATUS_LABEL = {
  waiting: 'WAITING',
  running: '● RUNNING',
  done: '✓ DONE',
}

export default function StepCard({ num, title, desc, status }) {
  const cardClass = status === 'running' ? 'active' : status === 'done' ? 'done' : ''
  const statusClass = `status-${status}`

  return (
    <div className={`step-card ${cardClass}`}>
      <div className="step-header">
        <span className="step-num">{num}</span>
        <span className="step-title">{title}</span>
        <span className={`step-status ${statusClass}`}>{STATUS_LABEL[status]}</span>
      </div>
      {desc && <div className="step-desc">{desc}</div>}
    </div>
  )
}
