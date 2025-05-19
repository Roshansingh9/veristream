import os
import httpx
import json
from typing import Dict
import logging
from utils.fact_checker import fact_check_text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load your Groq API key securely
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"  

# System prompt to guide Groq's LLM to structure its response
SYSTEM_PROMPT = """
You are a text authenticity verification system.

You will be provided with a piece of text. Your job is to:
1. Determine whether the text is VALID (genuine, meaningful, and trustworthy) or INVALID (nonsensical, misleading, or fabricated)
2. Determine if the text contains FRAUDULENT or SCAM-like content
3. Estimate the likelihood of the text being AI-GENERATED
4. For each determination, explain your reasoning clearly
5. At last summarize the entire given text in a few sentences

Respond in the following JSON format:

{
  "authenticity": "Valid" or "Invalid",
  "authenticity_reason": "Your explanation here",
  "fraudulent": true or false,
  "fraud_reason": "Your explanation here",
  "ai_generated": true or false,
  "ai_reason": "Your explanation here",
  "summary": "Your summary here"
}
"""

async def analyze_text(text: str) -> Dict:
   
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY environment variable not set")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    
    fact_check_result = fact_check_text(text)


    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Analyze the following text:\n\n{text}"}
    ]

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "response_format": {"type": "json_object"}  
    }

    async with httpx.AsyncClient(timeout=30.0) as client:  
        try:
            logger.info(f"Sending request to Groq API for text: '{text[:50]}...'")
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            
            # Debug log to see what we're getting back
            logger.info(f"Received response from Groq API: {result}")
            
            if "choices" not in result or not result["choices"]:
                logger.error("No choices found in Groq API response")
                raise RuntimeError("No choices found in Groq API response")
                
            content = result["choices"][0]["message"]["content"]
            logger.info(f"Content from Groq API: {content}")
            
            if not content.strip():
                logger.error("Empty content received from Groq API")
                raise RuntimeError("Empty content received from Groq API")

            # Try to parse Groq's JSON response
            try:
                structured = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {e}, Content: '{content}'")
                
                # Fallback response when JSON parsing fails
                return {
                    "authenticity": "Unknown",
                    "authenticity_reason": "Failed to analyze due to technical issues",
                    "fraudulent": False,
                    "fraud_reason": "Failed to analyze due to technical issues",
                    "ai_generated": False,
                    "ai_reason": "Failed to analyze due to technical issues",
                    "summary":"Failed to analyze due to technical issues"
                }

            # Validate required keys
            required_keys = {
                "authenticity", "authenticity_reason",
                "fraudulent", "fraud_reason",
                "ai_generated", "ai_reason"
            }
            
            missing_keys = required_keys - structured.keys()
            if missing_keys:
                logger.warning(f"Missing keys in response: {missing_keys}")
                # Add missing keys with default values
                for key in missing_keys:
                    if key.endswith("_reason"):
                        structured[key] = "No specific reason provided"
                    elif key == "fraudulent" or key == "ai_generated":
                        structured[key] = False
                    else:
                        structured[key] = "Unknown"
                        
            structured["Extras"] = fact_check_result
            return structured

        except httpx.RequestError as e:
            logger.error(f"Network error during analysis: {e}")
            raise RuntimeError(f"Network error during analysis: {e}") from e
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error during analysis: {e.response.text}")
            raise RuntimeError(f"HTTP error during analysis: {e.response.status_code}") from e
        except Exception as e:
            logger.error(f"Unexpected error during analysis: {e}")
            raise RuntimeError(f"Unexpected error during analysis: {e}") from e