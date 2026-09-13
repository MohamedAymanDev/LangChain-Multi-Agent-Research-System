import ReactMarkdown from 'react-markdown'

function downloadMarkdown(content, topic) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `research_report_${Date.now()}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ResultsSection({ results }) {
  if (!results) return null

  const { topic, search_results, scraped_content, report, feedback } = results

  return (
    <>
      <div className="divider" />
      <div className="section-heading">Results</div>

      {search_results && (
        <details className="expander">
          <summary>🔍 Search Results (raw)</summary>
          <div className="result-panel">
            <div className="result-panel-title">Search Agent Output</div>
            <div className="result-content">{search_results}</div>
          </div>
        </details>
      )}

      {scraped_content && (
        <details className="expander">
          <summary>📄 Scraped Content (raw)</summary>
          <div className="result-panel">
            <div className="result-panel-title">Reader Agent Output</div>
            <div className="result-content">{scraped_content}</div>
          </div>
        </details>
      )}

      {report && (
        <div className="report-panel">
          <div className="panel-label orange">📝 Final Research Report</div>
          <div className="markdown-body">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
          <button className="download-button" onClick={() => downloadMarkdown(report, topic)}>
            ⬇ Download Report (.md)
          </button>
        </div>
      )}

      {feedback && (
        <div className="feedback-panel">
          <div className="panel-label green">🧐 Critic Feedback</div>
          <div className="markdown-body">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  )
}
