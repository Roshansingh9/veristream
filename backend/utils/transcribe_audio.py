from groq import Groq
import os
from fastapi import UploadFile, HTTPException
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable not set")

client = Groq(api_key=api_key)

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

async def transcribe(file: UploadFile):
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large for transcription service.")
    
    
    transcription = client.audio.transcriptions.create(
        file=(file.filename, contents),
        model="distil-whisper-large-v3-en",
        response_format="verbose_json",
    )
    return {"text": transcription.text}