from src.Tools.tools import web_search, scarp_url
from src.Agents.agents import llm
# res = web_search.invoke("Find Roadmap of Frontend")
# print(res)

# url = "https://en.wikipedia.org/wiki/Artificial_intelligence"
# res = scarp_url.invoke(url)
# print(res)

res = llm.invoke("Say Hello in one sentenc")
print(res.content)
