import requests
import nltk
from nltk.tokenize import sent_tokenize
import wikipedia
import re
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Download NLTK tokenizer data if not present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

def clean_text(text):
    text = re.sub(r'\[\d+\]|\[citation needed\]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def fetch_fact_check(query):
    """Fetch fact-check data from Google's Fact Check API"""
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "query": query[:200],
        "key": GOOGLE_API_KEY,
        "languageCode": "en"
    }
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if "claims" in data:
                return [
                    {
                        "text": claim["text"],
                        "verdict": claim["claimReview"][0]["textualRating"],
                        "source": claim["claimReview"][0]["url"]
                    }
                    for claim in data["claims"]
                ]
    except Exception as e:
        print(f"Fact Check API Error: {e}")
    return []

def search_wikipedia(text):
    """Try to find a Wikipedia summary of the topic"""
    try:
        first_sentence = sent_tokenize(text)[0]
        keywords = ' '.join(re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', first_sentence))
        if not keywords:
            keywords = ' '.join(first_sentence.split()[:5])
        results = wikipedia.search(keywords, results=1)
        if results:
            page = wikipedia.page(results[0], auto_suggest=False)
            return {
                "text": page.summary,
                "source": page.url
            }
    except Exception as e:
        print(f"Wikipedia error: {e}")
    return None

def fact_check_text(text):
    cleaned_text = clean_text(text)
    fact_results = fetch_fact_check(cleaned_text)
    wiki_result = search_wikipedia(cleaned_text)

    if fact_results:
        
        source = fact_results[0]["source"]
        alert = fact_results[0]["verdict"]
        confidence = 75  
    elif wiki_result:
        source = wiki_result["source"]
        alert = "Needs Verification"
        confidence = 50
    else:
        source = None
        alert = "No Data"
        confidence = 0

    return {
        "alert": alert,
        "confidence": confidence,
        "source": source
    }
