from fastapi import FastAPI,File,UploadFile,HTTPException
from utils.language import translate_language
from utils.url_checker import check_url
from utils.transcribe_audio import transcribe
from utils.url_summary import summarize_content



app = FastAPI()


    
    
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/translate")
async def translate(text,language):
    return translate_language(text,language)

@app.get("/check_url")
async def check(url):
    return check_url(url)

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    return await transcribe(file)



@app.post("/url_summary")
async def summarize_url(url: str):
    return summarize_content(url)
    