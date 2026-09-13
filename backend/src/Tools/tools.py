# import library needed in tool file
import os
import requests
from dotenv import load_dotenv

from langchain.tools import tool
from tavily import TavilyClient

from bs4 import BeautifulSoup
from readability import Document
import trafilatura

from rich import print
import re


# load .env
load_dotenv()


# Tavily client
tavily = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)


# =========================================================
# TOOL 1 : WEB SEARCH
# =========================================================

@tool
def web_search(query: str) -> str:
    """
    Search the web for recent and reliable information.
    Returns titles, URLs and snippets.
    """

    try:
        results = tavily.search(
            query=query,
            max_results=5
        )

        out = []

        for r in results.get("results", []):
            out.append(
                f"Title: {r.get('title', 'No title')}\n"
                f"URL: {r.get('url', 'No URL')}\n"
                f"Snippet: {r.get('content', '')[:300]}\n"
            )

        if not out:
            return "No search results found."

        return "\n----\n".join(out)

    except Exception as e:
        return f"WEB_SEARCH_FAILED: {str(e)}"


# =========================================================
# TOOL 2 : SCRAPING
# =========================================================

@tool
def scarp_url(url: str) -> str:
    """
    Scrape and extract clean readable content from a URL.
    Uses multiple extraction strategies for better reliability.
    """

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/",
    }

    try:
        # -------------------------------------------------
        # STEP 1 → Request webpage
        # -------------------------------------------------

        try:
            response = requests.get(
                url=url,
                headers=headers,
                timeout=(5, 10),
            )

            response.raise_for_status()

        except requests.exceptions.Timeout:
            return "SCRAPE_FAILED: Request timed out."

        except requests.exceptions.ConnectionError:
            return (
                "SCRAPE_FAILED: Could not connect to this URL. "
                "The remote server closed the connection."
            )

        except requests.exceptions.RequestException as e:
            return f"SCRAPE_FAILED: Request failed - {str(e)}"

        html = response.text

        # -------------------------------------------------
        # Strategy 1 → Trafilatura
        # BEST for articles / blogs
        # -------------------------------------------------

        try:
            extracted = trafilatura.extract(
                html,
                include_comments=False,
                include_tables=False
            )

            if extracted and len(extracted.strip()) > 200:
                cleaned = re.sub(r"\s+", " ", extracted)
                return cleaned[:5000]

        except Exception:
            pass

        # -------------------------------------------------
        # Strategy 2 → Readability
        # -------------------------------------------------

        try:
            doc = Document(html)
            clean_html = doc.summary()

            soup = BeautifulSoup(
                clean_html,
                "html.parser"
            )

            for tag in soup([
                "script",
                "style",
                "nav",
                "footer",
                "header",
                "aside",
                "form"
            ]):
                tag.decompose()

            text = soup.get_text(
                separator=" ",
                strip=True
            )

            if text and len(text.strip()) > 200:
                cleaned = re.sub(r"\s+", " ", text)
                return cleaned[:5000]

        except Exception:
            pass

        # -------------------------------------------------
        # Strategy 3 → Full page fallback
        # -------------------------------------------------

        try:
            soup = BeautifulSoup(
                html,
                "html.parser"
            )

            for tag in soup([
                "script",
                "style",
                "nav",
                "footer",
                "header",
                "aside",
                "form"
            ]):
                tag.decompose()

            text = soup.get_text(
                separator=" ",
                strip=True
            )

            cleaned = re.sub(r"\s+", " ", text)

            if cleaned:
                return cleaned[:5000]

        except Exception:
            pass

        return (
            "SCRAPE_FAILED: "
            "Could not extract meaningful content from the page."
        )

    except Exception as e:
        return f"SCRAPE_FAILED: Unexpected scraping error - {str(e)}"
