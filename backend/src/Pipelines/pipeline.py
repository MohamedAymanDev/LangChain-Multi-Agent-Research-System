from src.Agents.agents import (
    build_reader_agent,
    build_search_agent,
    writer_chain,
    critic_chain,
)


def run_research_pipeline(topic: str) -> dict:
    """
    Runs the full 4-stage multi-agent research pipeline:

    Search Agent -> Reader Agent -> Writer Chain -> Critic Chain.

    Returns:
        {
            "search_results": ...,
            "scraped_content": ...,
            "report": ...,
            "feedback": ...
        }
    """

    state = {}

    # ============================================================
    # STEP 1 - SEARCH AGENT
    # ============================================================

    print("\n" + " =" * 50)
    print("step 1 - search agent is working ...")
    print("=" * 50)

    search_agent = build_search_agent()

    search_result = search_agent.invoke({
        "messages": [
            (
                "user",
                f"Find recent, reliable and detailed information about: {topic}"
            )
        ]
    })

    state["search_results"] = search_result["messages"][-1].content

    print("\n search result \n")
    print(state["search_results"])

    # ============================================================
    # STEP 2 - READER AGENT
    # ============================================================

    print("\n" + " =" * 50)
    print("step 2 - Reader agent is scraping top resources ...")
    print("=" * 50)

    reader_agent = build_reader_agent()

    reader_result = reader_agent.invoke({
        "messages": [
            (
                "user",
                f"""
Based on the following search results about '{topic}', 
pick the most relevant URL and scrape it for deeper content.

Search Results:

{state['search_results'][:800]}
"""
            )
        ]
    })

    state["scraped_content"] = reader_result["messages"][-1].content

    print("\nscraped content:\n")
    print(state["scraped_content"])

    # ============================================================
    # STEP 3 - WRITER CHAIN
    # ============================================================

    print("\n" + " =" * 50)
    print("step 3 - Writer is drafting the report ...")
    print("=" * 50)

    research_combined = (
        f"SEARCH RESULTS:\n"
        f"{state['search_results']}\n\n"
        f"DETAILED SCRAPED CONTENT:\n"
        f"{state['scraped_content']}"
    )

    # IMPORTANT:
    # The writer still receives the full research content.
    # We are NOT reducing the final report.

    state["report"] = writer_chain.invoke({
        "topic": topic,
        "research": research_combined
    })

    print("\n Final Report\n")
    print(state["report"])

    # ============================================================
    # STEP 4 - CRITIC CHAIN
    # ============================================================

    print("\n" + " =" * 50)
    print("step 4 - critic is reviewing the report ")
    print("=" * 50)

    import time

    # ------------------------------------------------------------
    # Keep the FULL report for the user.
    #
    # Only create a shorter copy for the Critic.
    # ------------------------------------------------------------

    report_for_critic = state["report"]

    if len(report_for_critic) > 7000:
        report_for_critic = (
            report_for_critic[:7000]
            + "\n\n[Report truncated for critic review]"
        )

    # ------------------------------------------------------------
    # Retry mechanism for Groq 429 rate limits
    # ------------------------------------------------------------

    max_retries = 3

    for attempt in range(max_retries):

        try:

            state["feedback"] = critic_chain.invoke({
                "report": report_for_critic
            })

            # Critic succeeded
            break

        except Exception as e:

            error_message = str(e)

            # Check if the problem is Groq rate limiting
            if (
                "429" in error_message
                or "rate_limit_exceeded" in error_message
            ):

                if attempt < max_retries - 1:

                    print(
                        "\n⚠ Groq rate limit reached."
                    )

                    print(
                        "Waiting 12 seconds before retry..."
                    )

                    print(
                        f"Attempt {attempt + 1}/{max_retries}"
                    )

                    time.sleep(12)

                else:

                    print(
                        "\n❌ Critic failed after multiple retries."
                    )

                    raise

            else:

                # If the error is not a rate-limit error,
                # immediately raise it.
                raise

    # ============================================================
    # FINAL OUTPUT
    # ============================================================

    print("\n critic report \n")
    print(state["feedback"])

    return state