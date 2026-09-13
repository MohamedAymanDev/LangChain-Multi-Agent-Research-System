import { useEffect, useRef, useState } from 'react'
import PipelinePanel from './components/PipelinePanel.jsx'
import ResultsSection from './components/ResultsSection.jsx'
import { runResearch } from './api.js'

const EXAMPLES = [
  'Future of LLM in Tech Industry',
  'All Latest AI Agents in 2026',
  'Roadmap for AGI development in next 5 years',
]

// The backend runs the 4-stage pipeline synchronously and returns everything
// at once (no streaming). To keep the same "watch each agent work" feel as
// the Streamlit app, we advance the step indicator on a timer while the
// request is in flight, then snap to "all done" once the real response lands.
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
      setError(err.message || 'Something went wrong while running the pipeline.')
      setActiveIndex(-1)
    } finally {
      stopStepTimer()
      setRunning(false)
    }
  }

  const handleExampleClick = (ex) => {
    setTopic(ex)
  }

  return (
    <div className="app-shell">
      <div className="hero">
        <div className="hero-eyebrow">Multi-Agent AI System</div>
        <h1>
          Researcher<span>Agent</span>
        </h1>
        <p className="hero-sub">
          Four specialized AI agents collaborate — searching, scraping, writing,
          and critiquing — to deliver a polished research report on any topic.
        </p>
      </div>

      <div className="divider" />

      <div className="main-grid">
        <div>
          <div className="input-card">
            <label className="field-label" htmlFor="topic-input">
              Research Topic
            </label>
            <input
              id="topic-input"
              className="text-input"
              type="text"
              placeholder="e.g. Roadmap for AGI development in next 5 years"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !running && handleRun()}
              disabled={running}
            />

            {warning && <div className="warning-text">{warning}</div>}

            <button className="run-button" onClick={() => handleRun()} disabled={running}>
              {running ? 'Running…' : '⚡ Run Research Pipeline'}
            </button>

            {error && <div className="error-text">⚠ {error}</div>}
          </div>

          <div className="chips-row">
            <span className="chips-label">TRY →</span>
            {EXAMPLES.map((ex) => (
              <span key={ex} className="chip" onClick={() => handleExampleClick(ex)}>
                {ex}
              </span>
            ))}
          </div>
        </div>

        <div>
          <PipelinePanel activeIndex={activeIndex} done={done} />
        </div>
      </div>

      <ResultsSection results={results} />

      <div className="notice">
        ResearchAgent · Powered by LangChain multi-agent pipeline · FastAPI + React
      </div>
    </div>
  )
}
