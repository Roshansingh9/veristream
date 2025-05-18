from deep_translator import GoogleTranslator
from langdetect import detect
import pycountry
from pydantic import BaseModel

class ProcessedText(BaseModel):
    translated: str
    language: str

def translate_language(text, target_language):
    detected_lang = detect(text)
    translated = GoogleTranslator(source=detected_lang, target=target_language).translate(text)
    lang_info = pycountry.languages.get(alpha_2=detected_lang)

    return ProcessedText(
        translated=translated,
        language=lang_info.name if lang_info else "Unknown"
    )
