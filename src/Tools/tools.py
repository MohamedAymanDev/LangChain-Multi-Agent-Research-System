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

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# Web Search
@tool
def web_search(query:str)->str:
    """Search the web for recent and reliable information on a topic. Returns Titles, URLs and snippets."""
    results = tavily.search(query=query,max_results=5)
    # {
    # "results": [
    #     {
    #         "title": "...",
    #         "url": "...",
    #         "content": "..."
    #     },
    #     {
    #         "title": "...",
    #         "url": "...",
    #         "content": "..."
    #     }
    # ]
    # }
    out = []
    
    for r in results["results"]:
        out.append(
            f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\n"
        )
    return "\n----\n".join(out)    
    