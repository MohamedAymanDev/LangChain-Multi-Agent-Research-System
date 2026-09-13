// Base URL of the FastAPI backend. Configurable via Vite env var so the
// same build can point at different backends (local, staging, prod)
// without a code change. No API keys ever live in this file or bundle.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/health`)
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
  return res.json()
}

export async function runResearch(topic) {
  const res = await fetch(`${API_BASE_URL}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  })

  if (!res.ok) {
    let detail = `Request failed: ${res.status}`
    try {
      const body = await res.json()
      if (body?.detail) detail = body.detail
    } catch {
      // ignore parse errors, fall back to generic message
    }
    throw new Error(detail)
  }

  return res.json()
}
