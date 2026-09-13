import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'


// =========================================================
// DOWNLOAD MARKDOWN
// =========================================================

function downloadMarkdown(content) {
  const blob = new Blob([content], {
    type: 'text/markdown',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `research_report_${Date.now()}.md`

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}


// =========================================================
// CLEAN MARKDOWN
// =========================================================

function cleanMarkdown(text) {
  if (!text) return ''

  return text
    .replace(/\\<br\s*\/?>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(
      /\*?Note:\s*The URLs above are representative of the organizations and technologies referenced in the research\.\s*Exact URLs for specific reports were not provided in the source material\.\*?/gi,
      ''
    )
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(text) {
  if (!text) return ''

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}


// =========================================================
// HIGH QUALITY PDF
// =========================================================

async function downloadPDF(topic, report) {
  if (!report) {
    alert('Report not found.')
    return
  }

  let container = null
  let style = null

  try {
    const cleanedReport = cleanMarkdown(report)

    container = document.createElement('div')

    container.innerHTML = `
      <div class="pdf-report">

        <div class="pdf-header">
          <div class="pdf-brand">
            RESEARCHAGENT
          </div>

          <div class="pdf-header-line"></div>
        </div>

        <div class="pdf-cover">

          <div class="pdf-label">
            MULTI-AGENT AI RESEARCH
          </div>

          <h1>
            Research Report
          </h1>

          <div class="pdf-topic">
            ${escapeHTML(topic)}
          </div>

          <div class="pdf-date">
            Generated on ${new Date().toLocaleDateString()}
          </div>

        </div>

        <div class="pdf-content">

          <div class="markdown-body">
            <div id="pdf-markdown-content"></div>
          </div>

        </div>

        <div class="pdf-end">
          ResearchAgent · LangChain Multi-Agent System
        </div>

      </div>
    `

    style = document.createElement('style')

    style.innerHTML = `
      .pdf-report {
        width: 900px;
        box-sizing: border-box;
        background: #ffffff;
        color: #1f2937;
        padding: 70px 75px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 17px;
        line-height: 1.75;
      }

      .pdf-header {
        margin-bottom: 55px;
      }

      .pdf-brand {
        font-size: 17px;
        font-weight: 800;
        letter-spacing: 2px;
        color: #111827;
      }

      .pdf-header-line {
        height: 3px;
        width: 100%;
        background: #111827;
        margin-top: 12px;
      }

      .pdf-cover {
        padding-bottom: 55px;
        margin-bottom: 45px;
        border-bottom: 1px solid #d1d5db;
      }

      .pdf-label {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 2.5px;
        color: #7c3aed;
        margin-bottom: 18px;
      }

      .pdf-cover h1 {
        font-size: 42px;
        line-height: 1.15;
        margin: 0 0 24px;
        color: #111827;
      }

      .pdf-topic {
        font-size: 22px;
        line-height: 1.5;
        font-weight: 700;
        color: #374151;
        margin-bottom: 22px;
      }

      .pdf-date {
        font-size: 14px;
        color: #6b7280;
      }

      .pdf-content {
        font-size: 17px;
        color: #1f2937;
      }

      .pdf-content h1 {
        font-size: 30px;
        line-height: 1.3;
        color: #111827;
        margin: 38px 0 18px;
        padding-bottom: 9px;
        border-bottom: 3px solid #111827;
        page-break-after: avoid;
      }

      .pdf-content h2 {
        font-size: 25px;
        line-height: 1.35;
        color: #111827;
        margin: 34px 0 15px;
        page-break-after: avoid;
      }

      .pdf-content h3 {
        font-size: 21px;
        line-height: 1.4;
        color: #374151;
        margin: 28px 0 12px;
        page-break-after: avoid;
      }

      .pdf-content p {
        margin: 0 0 19px;
      }

      .pdf-content strong {
        color: #111827;
        font-weight: 800;
      }

      .pdf-content ul,
      .pdf-content ol {
        margin: 10px 0 22px;
        padding-left: 34px;
      }

      .pdf-content li {
        margin-bottom: 9px;
      }

      .pdf-content a {
        color: #2563eb;
        text-decoration: underline;
        word-break: break-word;
      }

      .pdf-content code {
        font-family: Consolas, Monaco, monospace;
        font-size: 14px;
        background: #f3f4f6;
        padding: 3px 6px;
        border-radius: 4px;
      }

      .pdf-content pre {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        padding: 18px;
        border-radius: 8px;
        overflow: hidden;
        margin: 22px 0;
      }

      .pdf-content pre code {
        background: transparent;
        padding: 0;
      }

      .pdf-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 25px 0 30px;
        font-size: 14px;
        table-layout: fixed;
      }

      .pdf-content thead {
        display: table-header-group;
      }

      .pdf-content tr {
        page-break-inside: avoid;
      }

      .pdf-content th {
        background: #f3f4f6;
        color: #111827;
        font-weight: 800;
        text-align: left;
        padding: 12px 10px;
        border: 1px solid #d1d5db;
        word-wrap: break-word;
      }

      .pdf-content td {
        padding: 11px 10px;
        border: 1px solid #d1d5db;
        vertical-align: top;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .pdf-content tbody tr:nth-child(even) {
        background: #fafafa;
      }

      .pdf-content blockquote {
        margin: 22px 0;
        padding: 15px 22px;
        border-left: 5px solid #7c3aed;
        background: #f9fafb;
        color: #4b5563;
      }

      .pdf-content hr {
        border: 0;
        border-top: 1px solid #d1d5db;
        margin: 30px 0;
      }

      .pdf-end {
        margin-top: 55px;
        padding-top: 18px;
        border-top: 1px solid #d1d5db;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
    `

    document.head.appendChild(style)

    container.style.position = 'absolute'
    container.style.left = '-100000px'
    container.style.top = '0'
    container.style.width = '900px'
    container.style.background = '#ffffff'
    container.style.zIndex = '-9999'

    document.body.appendChild(container)

    const markdownTarget = container.querySelector(
      '#pdf-markdown-content'
    )

    const visibleReport = document.querySelector(
      '#final-report .markdown-body'
    )

    if (!visibleReport) {
      throw new Error('Final report element not found.')
    }

    const clonedReport = visibleReport.cloneNode(true)

    markdownTarget.appendChild(clonedReport)

    await new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      )
    )

    const canvas = await html2canvas(container, {
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      windowWidth: 900,
      scrollX: 0,
      scrollY: 0,
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const margin = 8
    const usableWidth = pdfWidth - margin * 2
    const usableHeight = pdfHeight - margin * 2

    const imageWidth = canvas.width
    const imageHeight = canvas.height

    const scale = usableWidth / imageWidth
    const pagePixelHeight = usableHeight / scale

    let sourceY = 0
    let pageNumber = 0

    while (sourceY < imageHeight) {
      pageNumber++

      if (pageNumber > 1) {
        pdf.addPage()
      }

      const remainingHeight = imageHeight - sourceY

      const currentPageHeight = Math.min(
        pagePixelHeight,
        remainingHeight
      )

      const pageCanvas = document.createElement('canvas')

      pageCanvas.width = imageWidth
      pageCanvas.height = currentPageHeight

      const ctx = pageCanvas.getContext('2d')

      ctx.fillStyle = '#ffffff'

      ctx.fillRect(
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      )

      ctx.drawImage(
        canvas,
        0,
        sourceY,
        imageWidth,
        currentPageHeight,
        0,
        0,
        imageWidth,
        currentPageHeight
      )

      const pageImage = pageCanvas.toDataURL(
        'image/png'
      )

      const renderedHeight =
        currentPageHeight * scale

      pdf.addImage(
        pageImage,
        'PNG',
        margin,
        margin,
        usableWidth,
        renderedHeight
      )

      sourceY += currentPageHeight
    }

    const totalPages =
      pdf.internal.getNumberOfPages()

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pdf.setPage(page)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(120, 120, 120)

      pdf.text(
        'ResearchAgent',
        margin,
        pdfHeight - 4
      )

      pdf.text(
        `Page ${page} of ${totalPages}`,
        pdfWidth - margin,
        pdfHeight - 4,
        {
          align: 'right',
        }
      )
    }

    pdf.save(
      `research_report_${Date.now()}.pdf`
    )

  } catch (error) {
    console.error(
      'PDF generation failed:',
      error
    )

    alert(
      'Could not generate the PDF. Please try again.'
    )

  } finally {
    if (container) {
      container.remove()
    }

    if (style) {
      style.remove()
    }
  }
}


// =========================================================
// MARKDOWN VIEWER
// =========================================================

function MarkdownViewer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {cleanMarkdown(content)}
      </ReactMarkdown>
    </div>
  )
}


// =========================================================
// RESULTS SECTION
// =========================================================

export default function ResultsSection({ results }) {
  if (!results) return null

  const {
    topic,
    search_results,
    scraped_content,
    report,
    feedback,
  } = results

  return (
    <section className="results-section">

      {/* ================================================= */}
      {/* RESULTS HEADER */}
      {/* ================================================= */}

      <div className="divider" />

      <div className="results-header">

        <div>
          <div className="results-kicker">
            INTELLIGENCE OUTPUT
          </div>

          <h2 className="section-heading">
            Research Results
          </h2>

          <p className="results-subtitle">
            Intelligence collected, synthesized and reviewed
            by the multi-agent research pipeline.
          </p>
        </div>

        <div className="results-status">
          <span className="results-status-dot" />
          ANALYSIS COMPLETE
        </div>

      </div>


      {/* ================================================= */}
      {/* SOURCE INTELLIGENCE */}
      {/* ================================================= */}

      {search_results && (
        <details className="result-module">

          <summary className="result-module-header">

            <div className="result-module-identity">

              <span className="result-module-number">
                01
              </span>

              <div>
                <span className="result-module-kicker">
                  SOURCE INTELLIGENCE
                </span>

                <span className="result-module-title">
                  Search Agent Output
                </span>
              </div>

            </div>

            <span className="result-module-action">
              VIEW DATA +
            </span>

          </summary>

          <div className="result-module-content">

            <div className="result-module-meta">
              <span className="module-dot" />
              WEB SEARCH COMPLETED
            </div>

            <MarkdownViewer content={search_results} />

          </div>

        </details>
      )}


      {/* ================================================= */}
      {/* DEEP READING */}
      {/* ================================================= */}

      {scraped_content && (
        <details className="result-module">

          <summary className="result-module-header">

            <div className="result-module-identity">

              <span className="result-module-number">
                02
              </span>

              <div>
                <span className="result-module-kicker">
                  DEEP READING
                </span>

                <span className="result-module-title">
                  Reader Agent Output
                </span>
              </div>

            </div>

            <span className="result-module-action">
              VIEW DATA +
            </span>

          </summary>

          <div className="result-module-content">

            <div className="result-module-meta">
              <span className="module-dot" />
              SOURCE EXTRACTION COMPLETED
            </div>

            <MarkdownViewer content={scraped_content} />

          </div>

        </details>
      )}


      {/* ================================================= */}
      {/* FINAL REPORT */}
      {/* ================================================= */}

      {report && (
        <div
          className="report-panel"
          id="final-report"
        >

          <div className="report-panel-top">

            <div>

              <div className="panel-label purple">
                FINAL INTELLIGENCE REPORT
              </div>

              <h3 className="report-heading">
                Research Report
              </h3>

            </div>

            <div className="report-complete">
              <span />
              VERIFIED OUTPUT
            </div>

          </div>


          <div className="report-topic">

            <span className="report-topic-label">
              RESEARCH TARGET
            </span>

            <span className="report-topic-value">
              {topic}
            </span>

          </div>


          <div className="report-divider" />

          <MarkdownViewer content={report} />


          {/* DOWNLOAD AREA */}

          <div className="download-area">

            <div className="download-info">

              <span className="download-kicker">
                EXPORT REPORT
              </span>

              <span className="download-description">
                Save the generated intelligence for later use.
              </span>

            </div>

            <div className="download-buttons">

              <button
                className="download-button"
                onClick={() =>
                  downloadMarkdown(report)
                }
              >
                <span>↓</span>
                MARKDOWN
              </button>

              <button
                className="download-button pdf-button"
                onClick={() =>
                  downloadPDF(topic, report)
                }
              >
                <span>↓</span>
                PDF REPORT
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ================================================= */}
      {/* CRITIC REVIEW */}
      {/* ================================================= */}

      {feedback && (
        <div className="feedback-panel">

          <div className="feedback-header">

            <div>

              <div className="panel-label green">
                QUALITY CONTROL
              </div>

              <h3 className="feedback-heading">
                Critic Review
              </h3>

            </div>

            <div className="critic-status">
              <span />
              REVIEW COMPLETED
            </div>

          </div>

          <div className="feedback-divider" />

          <MarkdownViewer content={feedback} />

        </div>
      )}

    </section>
  )
}