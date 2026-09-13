# Import needed librarys

from langchain.agents import create_agent 

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
from src.Tools.tools import web_search , scarp_url


# Load env
load_dotenv()

# LLM
llm = ChatGroq(model="openai/gpt-oss-20b",temperature=0)

