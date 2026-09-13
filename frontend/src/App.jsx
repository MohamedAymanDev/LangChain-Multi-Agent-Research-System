import { useEffect, useRef, useState } from 'react'
import PipelinePanel from './components/PipelinePanel.jsx'
import ResultsSection from './components/ResultsSection.jsx'
import { runResearch } from './api.js'

const EXAMPLES = [
  'Future of LLM in Tech Industry',
  'All Latest AI Agents in 2026',
  'Roadmap for AGI development in next 5 years',
]

const STEP_INTERVAL_MS = 4500

export default function App() {
  const [topic, setTopic] = useState('')
  const [running, setRunning] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [done, setDone] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const startStepTimer = () => {
    setActiveIndex(0)

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => Math.min(prev + 1, 3))
    }, STEP_INTERVAL_MS)
  }

  const stopStepTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  const handleRun = async (topicOverride) => {
    const finalTopic = (topicOverride ?? topic).trim()

    if (!finalTopic) {
      setWarning('Please enter a research topic first.')
      return
    }

    setWarning('')
    setError('')
    setResults(null)
    setDone(false)
    setRunning(true)

    startStepTimer()

    try {
      const data = await runResearch(finalTopic)

      setResults(data)
      setActiveIndex(3)
      setDone(true)
    } catch (err) {
      setError(
        err.message ||
          'Something went wrong while running the research pipeline.'
      )

      setActiveIndex(-1)
    } finally {
      stopStepTimer()
      setRunning(false)
    }
  }

  const handleExampleClick = (example) => {
    setTopic(example)
    setWarning('')
    setError('')
  }

  const getSystemStatus = () => {
    if (running) return 'PROCESSING'
    if (done) return 'COMPLETE'
    if (error) return 'ERROR'
    return 'READY'
  }

  const systemStatus = getSystemStatus()

  return (
    <div className="app-shell">

      {/* =====================================================
          TOP SYSTEM BAR
          ===================================================== */}

      <div className="top-bar">
        <div className="brand">
          <div className="brand-mark">
            RA
          </div>

          <div className="brand-info">
            <span className="brand-name">
              RESEARCH<span>AGENT</span>
            </span>

            <span className="brand-version">
              MULTI-AGENT RESEARCH SYSTEM
            </span>
          </div>
        </div>

        <div className="system-status">
          <span
            className={`system-dot ${
              running ? 'processing' : done ? 'complete' : ''
            }`}
          />

          <span>SYSTEM {systemStatus}</span>
        </div>
      </div>


      {/* =====================================================
          HERO
          ===================================================== */}

      <div className="hero">

        <div className="hero-eyebrow">
          AUTONOMOUS RESEARCH ENGINE
        </div>

        <h1>
          Your AI Research
          <br />
          <span>Team.</span>
        </h1>

        <p className="hero-sub">
          Four specialized AI agents collaborate to search, read, write,
          and critique — transforming a simple research topic into a
          structured intelligence report.
        </p>

        {/* HERO STATS */}

        <div className="hero-stats">

          <div className="hero-stat">
            <strong>04</strong>
            <span>AI AGENTS</span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat">
            <strong>01</strong>
            <span>PIPELINE</span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat">
            <strong>∞</strong>
            <span>TOPICS</span>
          </div>

        </div>

      </div>


      <div className="divider" />


      {/* =====================================================
          MAIN CONTROL CENTER
          ===================================================== */}

      <div className="main-grid">

        {/* =================================================
            LEFT — RESEARCH INPUT
            ================================================= */}

        <div>

          <div className="input-card">

            <div className="input-card-header">

              <div>
                <div className="field-label">
                  RESEARCH COMMAND
                </div>

                <div className="input-title">
                  What should the agents investigate?
                </div>
              </div>

              <div className="input-status">
                <span className="status-mini-dot" />
                AI READY
              </div>

            </div>


            <div className="input-wrapper">

              <span className="input-prefix">
                &gt;_
              </span>

              <input
                id="topic-input"
                className="text-input"
                type="text"
                placeholder="Enter your research topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !running) {
                    handleRun()
                  }
                }}
                disabled={running}
              />

            </div>


            {warning && (
              <div className="warning-text">
                ⚠ {warning}
              </div>
            )}


            <button
              className={`run-button ${running ? 'is-running' : ''}`}
              onClick={() => handleRun()}
              disabled={running}
            >

              <span className="run-button-icon">
                {running ? '◌' : '⚡'}
              </span>

              <span>
                {running
                  ? 'AGENTS ARE WORKING...'
                  : 'RUN RESEARCH PIPELINE'}
              </span>

            </button>


            {error && (
              <div className="error-text">
                ⚠ {error}
              </div>
            )}

          </div>


          {/* =================================================
              EXAMPLE TOPICS
              ================================================= */}

          <div className="examples-section">

            <div className="examples-header">
              <span className="examples-label">
                QUICK START
              </span>

              <span className="examples-line" />
            </div>


            <div className="chips-row">

              {EXAMPLES.map((example, index) => (
                <button
                  key={example}
                  className="chip"
                  onClick={() => handleExampleClick(example)}
                  disabled={running}
                >
                  <span className="chip-number">
                    0{index + 1}
                  </span>

                  {example}
                </button>
              ))}

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT — AGENT PIPELINE
            ================================================= */}

        <div className="pipeline-wrapper">

          <div className="pipeline-header">

            <div>
              <div className="pipeline-kicker">
                AGENT ORCHESTRATION
              </div>

              <h2 className="section-heading">
                Research Pipeline
              </h2>
            </div>

            <div className="pipeline-live">
              <span />
              LIVE
            </div>

          </div>


          <PipelinePanel
            activeIndex={activeIndex}
            done={done}
          />

        </div>

      </div>


      {/* =====================================================
          RESULTS
          ===================================================== */}

      <ResultsSection results={results} />


      {/* =====================================================
          SYSTEM FOOTER
          ===================================================== */}

      <div className="notice">

        <div className="footer-system">
          <span className="footer-dot" />
          SYSTEM OPERATIONAL
        </div>

        <div>
          ResearchAgent · LangChain Multi-Agent Architecture
        </div>

        <div>
          FastAPI + React
        </div>

      </div>

    </div>
  )
}
