import os
import traceback

from fastapi import FastAPI, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from src.Pipelines.pipeline import run_research_pipeline

load_dotenv()

app = FastAPI(
    title="Multi-Agent Research System API",
    description="Backend for the LangChain + Groq + Tavily multi-agent research pipeline.",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────
# Only the local Vite dev server (and whatever origin you deploy the
# frontend to) is allowed to call this API. GROQ_API_KEY / TAVILY_API_KEY
# never leave this backend process — the frontend only ever talks to
# these two endpoints.
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────
class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="The research topic to investigate.")


class ResearchResponse(BaseModel):
    topic: str
    search_results: str
    scraped_content: str
    report: str
    feedback: str


# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/research", response_model=ResearchResponse)
async def research(payload: ResearchRequest):
    topic = payload.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic must not be empty.")

    try:
        # run_research_pipeline is synchronous/blocking (LangChain + requests
        # calls under the hood), so it's offloaded to a threadpool to keep
        # FastAPI's event loop free for other requests.
        result = await run_in_threadpool(run_research_pipeline, topic)
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {exc}") from exc

    return ResearchResponse(
        topic=topic,
        search_results=result["search_results"],
        scraped_content=result["scraped_content"],
        report=result["report"],
        feedback=result["feedback"],
    )
