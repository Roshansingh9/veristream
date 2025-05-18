from fastapi import FastAPI, Query, HTTPException
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException
import pycountry
from pydantic import BaseModel
import langid
from typing import Optional

class ProcessedText(BaseModel):
    translated: str
    language: str

# Expanded language mappings with special focus on Indian languages
LANGUAGE_MAPPINGS = {
    # Indian languages
    'hi': 'Hindi',
    'bn': 'Bengali',
    'te': 'Telugu',
    'mr': 'Marathi',
    'ta': 'Tamil',
    'ur': 'Urdu',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi',
    'or': 'Odia',
    'as': 'Assamese',
    'sd': 'Sindhi',
    'sa': 'Sanskrit',
    'ne': 'Nepali',

    # Common international languages
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'zh': 'Chinese',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'ko': 'Korean',
    'ar': 'Arabic',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'pl': 'Polish',
    'ro': 'Romanian',
    'el': 'Greek',
    'cs': 'Czech',
    'fi': 'Finnish',
    'hu': 'Hungarian',
    'uk': 'Ukrainian',
    'he': 'Hebrew',
    'fa': 'Persian',
    'sw': 'Swahili',
}

# Common English words for better detection of short phrases
ENGLISH_WORDS = set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or',
    'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
    'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'can', 'will', 'just', 'don', 'should', 'now', 'hello', 'hi', 'hey', 'name',
])

# Words for some common Indian languages to improve detection
INDIAN_LANGUAGE_SAMPLES = {
    'hi': ['नमस्ते', 'आप', 'मैं', 'हम', 'वह', 'यह', 'और', 'में', 'का', 'है'],
    'bn': ['নমস্কার', 'আপনি', 'আমি', 'আমরা', 'সে', 'এটা', 'এবং', 'মধ্যে', 'এর', 'আছে'],
    'te': ['నమస్కారం', 'మీరు', 'నేను', 'మేము', 'అతను', 'ఇది', 'మరియు', 'లో', 'యొక్క', 'ఉంది'],
    'mr': ['नमस्कार', 'तुम्ही', 'मी', 'आम्ही', 'तो', 'हे', 'आणि', 'मध्ये', 'चा', 'आहे'],
    'ta': ['வணக்கம்', 'நீங்கள்', 'நான்', 'நாங்கள்', 'அவர்', 'இது', 'மற்றும்', 'உள்ளே', 'இன்', 'உள்ளது'],
    'gu': ['નમસ્તે', 'તમે', 'હું', 'અમે', 'તે', 'આ', 'અને', 'માં', 'ના', 'છે'],
    'kn': ['ನಮಸ್ಕಾರ', 'ನೀವು', 'ನಾನು', 'ನಾವು', 'ಅವರು', 'ಇದು', 'ಮತ್ತು', 'ಒಳಗೆ', 'ನ', 'ಇದೆ'],
    'ml': ['നമസ്കാരം', 'നിങ്ങൾ', 'ഞാൻ', 'ഞങ്ങൾ', 'അവൻ', 'ഇത്', 'കൂടാതെ', 'ഉള്ളിൽ', 'യുടെ', 'ആണ്'],
    'pa': ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਤੁਸੀਂ', 'ਮੈਂ', 'ਅਸੀਂ', 'ਉਹ', 'ਇਹ', 'ਅਤੇ', 'ਵਿੱਚ', 'ਦਾ', 'ਹੈ'],
    'ur': ['سلام', 'آپ', 'میں', 'ہم', 'وہ', 'یہ', 'اور', 'میں', 'کا', 'ہے'],
}

def get_language_name(lang_code):
    """Get the full language name from a language code"""
    # First check our custom mapping
    if lang_code in LANGUAGE_MAPPINGS:
        return LANGUAGE_MAPPINGS[lang_code]
    
    # Try with pycountry
    try:
        lang_info = pycountry.languages.get(alpha_2=lang_code)
        if lang_info and hasattr(lang_info, 'name'):
            return lang_info.name
    except Exception:
        pass
    
    # Return unknown with code if we can't identify it
    return f"Unknown ({lang_code})"

def detect_language(text):
    """Enhanced language detection with multiple methods and special handling for Indian languages"""
    if not text or text.strip() == "":
        return "en", 1.0  # Default to English for empty text
    
    original_text = text
    text = text.strip()
    
    # For English detection, check if text is primarily English words
    words = text.lower().split()
    english_word_count = sum(1 for word in words if word.lower() in ENGLISH_WORDS)
    english_word_ratio = english_word_count / max(1, len(words))
    
    # If high ratio of English words, consider it English
    if english_word_ratio > 0.4:
        return "en", 0.8 + (english_word_ratio * 0.2)  # Higher confidence with more English words
    
    # Check for obvious Indian language text based on character sets
    for lang_code, word_samples in INDIAN_LANGUAGE_SAMPLES.items():
        for word in word_samples:
            if word in text:
                return lang_code, 0.9
    
    # Try with langid and langdetect
    try:
        langid_lang, langid_confidence = langid.classify(text)
        langdetect_lang = detect(text)
        
        # If both methods agree, higher confidence
        if langid_lang == langdetect_lang:
            return langid_lang, max(0.7, langid_confidence)
        
        # Special case: If either detector thinks it's English and we have some English words
        if (langid_lang == 'en' or langdetect_lang == 'en') and english_word_ratio > 0.2:
            return "en", 0.6 + (english_word_ratio * 0.3)
            
        # For short texts, bias toward English if there's any doubt
        if len(words) <= 5 and english_word_ratio > 0.1:
            return "en", 0.5 + (english_word_ratio * 0.2)
            
        # For very short texts, use langdetect as fallback
        if len(words) <= 2:
            return langdetect_lang, 0.6
            
        # Default to langid result
        return langid_lang, langid_confidence
        
    except LangDetectException:
        # If langdetect fails, default to langid
        langid_lang, langid_confidence = langid.classify(text)
        return langid_lang, langid_confidence

def translate_language(text, target_language="en"):
    """Translate text with enhanced language detection"""
    # Detect the language
    detected_lang, confidence = detect_language(text)
    language_name = get_language_name(detected_lang)
    
    # If already in target language, just return the original
    if detected_lang == target_language:
        return ProcessedText(
            translated=text,
            language=language_name
        )
    
    # Otherwise translate
    try:
        translated = GoogleTranslator(source=detected_lang, target=target_language).translate(text)
        
        return ProcessedText(
            translated=translated,
            language=language_name
        )
    except Exception as e:
        # If translation fails, try with auto detection
        try:
            translated = GoogleTranslator(source='auto', target=target_language).translate(text)
            return ProcessedText(
                translated=translated,
                language=language_name
            )
        except Exception as e2:
            raise Exception(f"Translation failed: {str(e2)}")

# Additional utility functions for language handling

def get_supported_languages():
    """Return a list of all supported languages"""
    return {code: name for code, name in LANGUAGE_MAPPINGS.items()}

def is_indian_language(lang_code):
    """Check if a language code represents an Indian language"""
    indian_langs = ['hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'sd', 'sa', 'ne']
    return lang_code in indian_langs

def get_script_direction(lang_code):
    """Determine text direction for a language (RTL or LTR)"""
    rtl_languages = ['ar', 'he', 'ur', 'fa', 'sd']  # Arabic, Hebrew, Urdu, Persian, Sindhi
    return "rtl" if lang_code in rtl_languages else "ltr"