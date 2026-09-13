const AGENT_META = {
  'Search Agent': {
    role: 'WEB INTELLIGENCE',
    mode: 'DISCOVERY',
  },
  'Reader Agent': {
    role: 'SOURCE ANALYSIS',
    mode: 'EXTRACTION',
  },
  'Writer Chain': {
    role: 'REPORT GENERATION',
    mode: 'SYNTHESIS',
  },
  'Critic Chain': {
    role: 'QUALITY CONTROL',
    mode: 'VALIDATION',
  },
}

export default function StepCard({
  num,
  title,
  desc,
  status,
  icon,
  action,
}) {
  const meta = AGENT_META[title] || {
    role: 'AI MODULE',
    mode: 'PROCESSING',
  }

  const isRunning = status === 'running'
  const isDone = status === 'done'

  return (
    <div
      className={`agent-card ${
        isRunning ? 'agent-card-running' : ''
      } ${isDone ? 'agent-card-done' : ''}`}
    >
      {/* TOP BAR */}
      <div className="agent-card-top">

        <div className="agent-id">
          <span className="agent-id-number">{num}</span>

          <span className="agent-id-line" />

          <span className="agent-id-role">
            {meta.role}
          </span>
        </div>

        <div
          className={`agent-status ${
            isRunning
              ? 'status-live'
              : isDone
                ? 'status-complete'
                : 'status-waiting'
          }`}
        >
          <span className="agent-status-dot" />

          {isRunning
            ? 'LIVE'
            : isDone
              ? 'COMPLETED'
              : 'STANDBY'}
        </div>

      </div>

      {/* AGENT CORE */}
      <div className="agent-card-body">

        <div className="agent-visual">

          <div className="agent-orbit orbit-one" />
          <div className="agent-orbit orbit-two" />
          <div className="agent-orbit orbit-three" />

          <div className="agent-card-core">

            <div className="agent-core-light" />

            <span className="agent-card-icon">
              {icon || '◉'}
            </span>

          </div>

          {isRunning && (
            <>
              <span className="agent-particle particle-a" />
              <span className="agent-particle particle-b" />
              <span className="agent-particle particle-c" />
            </>
          )}

        </div>

        {/* INFO */}
        <div className="agent-card-info">

          <span className="agent-mode">
            {meta.mode}
          </span>

          <h2>{title}</h2>

          <p>{desc}</p>

          <div className="agent-current-task">

            <span className="task-indicator">
              {isDone ? '✓' : isRunning ? '◉' : '○'}
            </span>

            <span>
              {isDone
                ? 'MODULE COMPLETED'
                : isRunning
                  ? action || 'PROCESSING'
                  : 'WAITING FOR HANDOFF'}
            </span>

            {isRunning && (
              <span className="task-dots">
                <i />
                <i />
                <i />
              </span>
            )}

          </div>

        </div>

      </div>

      {/* PROCESSING BAR */}
      {isRunning && (
        <div className="agent-processing">

          <div className="processing-header">
            <span>AGENT ACTIVITY</span>
            <span>ACTIVE</span>
          </div>

          <div className="processing-track">
            <span className="processing-fill" />
            <span className="processing-scanner" />
          </div>

        </div>
      )}

      {/* DONE STATE */}
      {isDone && (
        <div className="agent-complete">

          <span className="complete-icon">✓</span>

          <span>
            OUTPUT READY FOR NEXT AGENT
          </span>

          <span className="complete-arrow">
            →
          </span>

        </div>
      )}

    </div>
  )
}