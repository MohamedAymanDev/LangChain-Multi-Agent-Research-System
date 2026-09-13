import { useEffect, useState } from 'react'
import StepCard from './StepCard.jsx'

const STEPS = [
  {
    key: 'search',
    num: '01',
    title: 'Search Agent',
    desc: 'Scans the web and gathers recent intelligence',
    icon: '⌕',
    action: 'SCANNING THE WEB',
  },
  {
    key: 'reader',
    num: '02',
    title: 'Reader Agent',
    desc: 'Scrapes sources and extracts deep context',
    icon: '◫',
    action: 'READING SOURCES',
  },
  {
    key: 'writer',
    num: '03',
    title: 'Writer Chain',
    desc: 'Synthesizes findings into a structured report',
    icon: '✦',
    action: 'GENERATING REPORT',
  },
  {
    key: 'critic',
    num: '04',
    title: 'Critic Chain',
    desc: 'Reviews, validates and scores the final report',
    icon: '◇',
    action: 'REVIEWING QUALITY',
  },
]

export default function PipelinePanel({ activeIndex, done }) {
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (activeIndex < 0) {
      setDisplayedIndex(-1)
      return
    }

    if (activeIndex === displayedIndex) {
      return
    }

    setTransitioning(true)

    const timer = setTimeout(() => {
      setDisplayedIndex(activeIndex)
      setTransitioning(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeIndex, displayedIndex])

  const currentStep =
    displayedIndex >= 0 ? STEPS[displayedIndex] : null

  const isRunning =
    activeIndex >= 0 && !done

  return (
    <div className="pipeline-panel">

      {/* TOP LABEL */}
      <div className="handoff-header">
        <div>
          <span className="pipeline-kicker">
            LIVE AGENT ORCHESTRATION
          </span>

          <div className="handoff-title">
            Autonomous Handoff
          </div>
        </div>

        <div className={`handoff-live ${isRunning ? 'active' : ''}`}>
          <span />
          {done ? 'COMPLETE' : isRunning ? 'LIVE' : 'STANDBY'}
        </div>
      </div>

      {/* AGENT STAGE */}
      <div
        className={`agent-stage ${
          transitioning ? 'handoff-transition' : ''
        } ${done ? 'pipeline-success' : ''}`}
      >

        {/* Ambient rings */}
        <div className="agent-ring agent-ring-outer" />
        <div className="agent-ring agent-ring-middle" />
        <div className="agent-ring agent-ring-inner" />

        {/* Moving energy particles */}
        {isRunning && (
          <>
            <span className="energy-particle particle-one" />
            <span className="energy-particle particle-two" />
            <span className="energy-particle particle-three" />
            <span className="energy-particle particle-four" />
          </>
        )}

        {/* CURRENT AGENT */}
        {currentStep && (
          <div
            className={`agent-focus ${
              isRunning ? 'agent-active' : ''
            } ${transitioning ? 'agent-exiting' : ''}`}
          >

            <div className="agent-number">
              {currentStep.num}
            </div>

            <div className="agent-core">
              <div className="agent-core-glow" />

              <span className="agent-icon">
                {currentStep.icon}
              </span>

              <span className="agent-core-scan" />
            </div>

            <div className="agent-info">
              <span className="agent-label">
                CURRENT AGENT
              </span>

              <h3>{currentStep.title}</h3>

              <p>{currentStep.desc}</p>

              <div className="agent-action">
                <span className="agent-action-dot" />

                {done
                  ? 'PROCESS COMPLETE'
                  : currentStep.action}

                {!done && (
                  <span className="typing-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </div>
            </div>

          </div>
        )}

        {/* IDLE */}
        {activeIndex < 0 && !done && (
          <div className="agent-idle">
            <div className="idle-core">
              ◉
            </div>

            <span>AWAITING RESEARCH COMMAND</span>

            <p>
              Start the pipeline to activate the first agent.
            </p>
          </div>
        )}

        {/* COMPLETED */}
        {done && (
          <div className="completion-badge">
            <span>✓</span>
            RESEARCH PIPELINE COMPLETE
          </div>
        )}
      </div>

      {/* HANDOFF INDICATOR */}
      {isRunning && activeIndex < STEPS.length - 1 && (
        <div className="handoff-indicator">

          <div className="handoff-arrow">
            <span className="handoff-energy" />
          </div>

          <div className="handoff-copy">
            <span>HANDOFF PROTOCOL</span>

            <strong>
              Preparing transfer to{' '}
              {STEPS[activeIndex + 1].title}
            </strong>
          </div>

        </div>
      )}

      {/* PROGRESS */}
      <div className="agent-progress">

        {STEPS.map((step, index) => {
          const isCurrent = index === activeIndex
          const isComplete = done || index < activeIndex

          return (
            <div
              key={step.key}
              className={`progress-node ${
                isCurrent ? 'current' : ''
              } ${isComplete ? 'complete' : ''}`}
            >
              <span className="progress-dot">
                {isComplete ? '✓' : step.num}
              </span>

              <span className="progress-label">
                {step.title.replace(' Chain', '')}
              </span>
            </div>
          )
        })}

      </div>

      {/* FOOTER STATUS */}
      <div className="pipeline-footer">

        <span className="pipeline-footer-line" />

        <span className="pipeline-footer-status">

          <span
            className={`pipeline-status-dot ${
              done
                ? 'status-done'
                : activeIndex >= 0
                  ? 'status-running'
                  : ''
            }`}
          />

          {done
            ? 'ALL AGENTS COMPLETED'
            : activeIndex >= 0
              ? `${STEPS[activeIndex].title.toUpperCase()} ACTIVE`
              : 'PIPELINE STANDBY'}

        </span>

        <span className="pipeline-footer-line" />

      </div>
    </div>
  )
}