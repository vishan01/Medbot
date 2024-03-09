from load import load_pdf, text_split, download_hugging_face_embeddings
from langchain.vectorstores import Pinecone 
import pinecone

from dotenv import load_dotenv
import os
import warnings
warnings.filterwarnings("ignore")

load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')


#print(PINECONE_API_KEY)
# print(PINECONE_API_ENV)

extracted_data = load_pdf("")
text_chunks = text_split(extracted_data)
embeddings = download_hugging_face_embeddings()


#Initializing the Pinecone
pc=pinecone.init(api_key=PINECONE_API_KEY,environment="gcp-starter")
index_name="medical-chatbot"


#Creating Embeddings for Each of The Text Chunks & storing
docsearch=Pinecone.from_texts([t.page_content for t in text_chunks], embeddings, index_name=index_name)
