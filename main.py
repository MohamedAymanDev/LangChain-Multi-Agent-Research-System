from src.Tools.tools import web_search, scarp_url

# res = web_search.invoke("Find Roadmap of Frontend")
# print(res)

url = "https://en.wikipedia.org/wiki/Artificial_intelligence"
res = scarp_url.invoke(url)
print(res)