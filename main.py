from src.Tools.tools import web_search, scarp_url
from src.Agents.agents import llm , build_search_agent , build_reader_agent

# Build agent 
search_agent = build_search_agent()
reader_agent = build_reader_agent()

# test 
search_res = search_agent.invoke({
    'messages':[
        {
            'role':'user',
            'content':'Find information abot GPT 6'
        }
    ]
})

# print(search_res)
reder_res = reader_agent.invoke({
    'messages':[
        {
            'role' : 'user',
            'content':'Read this URL and Extract its main content: https://fastapi.tiangolo.com/'
        }
    ]
})
print(reder_res)