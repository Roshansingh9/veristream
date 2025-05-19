from fastapi import FastAPI,File,UploadFile,HTTPException
from utils.language import translate_language
from utils.url_checker import check_url
from utils.transcribe_audio import transcribe
from utils.url_summary import summarize_content
from utils.analyze_content import analyze_text
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vercel.com/roshan-kr-singhs-projects/veristream/GW6n4df8BHM2YZPjMtDrmY5n79qa"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
    
@app.get("/")
async def root():
    return {"message": "root"}



@app.get("/check_url")
async def check(url):
    return check_url(url)

@app.post("/analyze_audio")
async def transcribe_audio(file: UploadFile = File(...)):
    transcription = await transcribe(file)
    # Now we know transcription["transcript"] is a string
    translated_text = translate_language(transcription["transcript"])
    result = await analyze_text(translated_text.translated)
    
    return {**transcription, "translated": translated_text.translated, "language": translated_text.language, **result}


@app.post("/url_summary")
async def summarize_url(url: str):
    summary = summarize_content(url)
    result=await analyze_text(summary["summary"])
    return {**summary, **result}

@app.post("/analyze_text")
async def analyze(text: str):
    result= await analyze_text(text)
    return result




    
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=10000, reload=True)    