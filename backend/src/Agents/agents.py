# Import needed librarys

from langchain.agents import create_agent

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
from src.Tools.tools import web_search, scarp_url


# Load env
load_dotenv()

# LLM
llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0)

# =========================================================
# 1st Agent : Search Agent
# =========================================================

def build_search_agent():
    return create_agent(
        model=llm,
        tools=[web_search],
        system_prompt="""
                    You are a web research agent.

                    You have exactly one tool: web_search.

                    When using web_search, you MUST call it with exactly one argument:
                    query

                    Example:
                    {"query": "latest AI agents in 2026"}

                    Never use cursor, id, page, offset, or any other argument.

                    Always use the query argument when calling web_search.
                    """
                        )


# =========================================================
# 2nd Agent : Reader Agent
# =========================================================

def build_reader_agent():
    return create_agent(
        model=llm,
        tools=[scarp_url],
        system_prompt="""
                    You are a research reader agent.

                    You have exactly one tool: scarp_url.

                    When using scarp_url, you MUST call it with exactly one argument:
                    url

                    Example:
                    {"url": "https://example.com"}

                    Never use query, cursor, id, page, offset, or any other argument.

                    Always use the url argument when calling scarp_url.
                    """
                )


# Writer Agent
writer_prompt = ChatPromptTemplate([
    ("system", "You are an expert research writer. Write clear, structured and insightful reports."),
    ("human", """Write a detailed research report on the topic below.

    Topic: {topic}

    Research Gathered:
    {research}

    Structure the report as:
    - Introduction
    - Key Findings (minimum 3 well-explained points)
    - Conclusion
    - Sources (list all URLs found in the research)

    Be detailed, factual and professional."""),

])
writer_chain = writer_prompt | llm | StrOutputParser()

# critic_chain

critic_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are an expert research report critic.

Evaluate the report for:
- factual clarity
- structure and organization
- completeness
- source quality
- relevance to the research topic
- unsupported or questionable claims

Be concise but useful."""
    ),
    (
        "human",
        """Review the research report below.

Report:
{report}

Respond in exactly this format:

Score: X/10

Strengths:
- ...
- ...
- ...

Areas to Improve:
- ...
- ...
- ...

One line verdict:
...

Keep each point specific and concise."""
    ),
])

critic_chain = critic_prompt | llm | StrOutputParser()