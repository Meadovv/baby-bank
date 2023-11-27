import time
from bardapi import BardCookies
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckBody (BaseModel):
    question: str

@app.get('/')
def home():
    return {
        'Name': 'Warm Milk Assistant Server'
    }

@app.post('/get-answer')
async def crawl(payload: CheckBody):
    bard = BardCookies(token_from_browser=True)
    return {
        'success': True,
        'message': bard.get_answer(payload.question)['content'],
        'time': round(time.time() * 1000)
    }