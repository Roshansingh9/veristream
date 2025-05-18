from fastapi import FastAPI,File,UploadFile,HTTPException
from utils.language import translate_language
from utils.url_checker import check_url
from utils.transcribe_audio import transcribe
from utils.url_summary import summarize_content
from utils.analyze_content import analyze_text


app = FastAPI()


    
    
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/translate")
async def translate(text):
    return translate_language(text)

@app.get("/check_url")
async def check(url):
    return check_url(url)

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    return await transcribe(file)



@app.post("/url_summary")
async def summarize_url(url: str):
    return summarize_content(url)

@app.post("/analyze_text")
async def analyze(text: str):
    result= await analyze_text(text)
    return result
    