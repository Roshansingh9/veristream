import validators
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

def is_url_safe_google(url, api_key=API_KEY):
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
    body = {
        "client": {
            "clientId": "veristream",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": url}
            ]
        }
    }

    response = requests.post(endpoint, json=body)
    result = response.json()
    return result == {}  # True if safe, False if threats found

def is_valid_url(url):
    return validators.url(url)


    
    
def check_url(url):
    if is_valid_url(url):
        return is_url_safe_google(url)
    else:
        return "Invalid URL"


# Test
url = "https://www.google.com.roshan"
print(is_valid_url(url))