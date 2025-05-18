import re
import time
import requests
import urllib.parse  # Missing import for the webpage function
from youtube_transcript_api import YouTubeTranscriptApi
import wikipediaapi
from bs4 import BeautifulSoup
import os

# Load environment
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"  # API endpoint was missing

# Prompts
chunk_prompt = """You are summarizing a part of a larger content. Summarize this section concisely, focusing on key facts, arguments, and information. Don't try to introduce or conclude the entire topic, just focus on this specific section:

"""
# (other final prompts defined similarly)
final_prompts = {
    "youtube": (
        "You are an expert YouTube video summarizer with exceptional attention to detail.\n\n"
        "Below are summaries of different parts of a YouTube video transcript. Your task is to create a final, coherent summary that integrates all these sections into one comprehensive summary that captures:\n"
        "1. The main topic and purpose of the video\n"
        "2. Key points, insights, and arguments presented\n"
        "3. Important facts, statistics, and examples mentioned\n"
        "4. Any conclusions or recommendations\n\n"
        "Please format your summary as follows:\n"
        "- Begin with a brief overview of the video's main topic (1-2 sentences)\n"
        "- Follow with structured bullet points highlighting the most important information\n"
        "- Ensure no significant details are omitted\n"
        "- Maintain the original meaning and intent of the content\n"
        "- Keep the entire summary within 300-400 words for readability while preserving comprehensive coverage\n\n"
        "The section summaries are as follows:\n"
    ),

    "wikipedia": (
        "You are an expert Wikipedia article summarizer with exceptional attention to detail.\n\n"
        "Below are summaries of different parts of a Wikipedia article. Your task is to create a final, coherent summary that integrates all these sections into one comprehensive summary that captures:\n"
        "1. The main subject and significance\n"
        "2. Key facts, definitions, and historical information\n"
        "3. Important developments, relationships, and concepts\n"
        "4. Notable controversies or alternative viewpoints (if any)\n\n"
        "Please format your summary as follows:\n"
        "- Begin with a brief overview of the article's main subject (1-2 sentences)\n"
        "- Follow with structured bullet points highlighting the most important information\n"
        "- Ensure no significant details are omitted\n"
        "- Maintain the original meaning and intent of the content\n"
        "- Keep the entire summary within 300-400 words for readability while preserving comprehensive coverage\n\n"
        "The section summaries are as follows:\n"
    ),

    "webpage": (
        "You are an expert web content summarizer with exceptional attention to detail.\n\n"
        "Below are summaries of different parts of a webpage article. Your task is to create a final, coherent summary that integrates all these sections into one comprehensive summary that captures:\n"
        "1. The main topic and purpose of the article\n"
        "2. Key points, insights, and arguments presented\n"
        "3. Important facts, statistics, and examples mentioned\n"
        "4. Any conclusions or recommendations\n\n"
        "Please format your summary as follows:\n"
        "- Begin with a brief overview of the article's main topic (1-2 sentences)\n"
        "- Follow with structured bullet points highlighting the most important information\n"
        "- Ensure no significant details are omitted\n"
        "- Maintain the original meaning and intent of the content\n"
        "- Keep the entire summary within 300-400 words for readability while preserving comprehensive coverage\n\n"
        "The section summaries are as follows:\n"
    )
}


def split_into_chunks(text: str, max_chunk_size: int = 4000) -> list:
    """Split text into chunks, respecting sentence boundaries when possible."""
    # If text is already small enough, return it as a single chunk
    if len(text) <= max_chunk_size:
        return [text]
    
    # Try to split at sentence boundaries
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks, current_chunk, current_size = [], [], 0
    
    for sentence in sentences:
        # If adding this sentence would exceed the limit
        if current_size + len(sentence) + 1 > max_chunk_size and current_chunk:
            # If a single sentence is too long, split it by words
            if not current_chunk and len(sentence) > max_chunk_size:
                words = sentence.split()
                temp_chunk, temp_size = [], 0
                
                for word in words:
                    if temp_size + len(word) + 1 > max_chunk_size and temp_chunk:
                        chunks.append(' '.join(temp_chunk))
                        temp_chunk, temp_size = [word], len(word) + 1
                    else:
                        temp_chunk.append(word)
                        temp_size += len(word) + 1
                
                if temp_chunk:
                    chunks.append(' '.join(temp_chunk))
            else:
                # Otherwise, add the current chunk and start a new one
                chunks.append(' '.join(current_chunk))
                current_chunk, current_size = [sentence], len(sentence) + 1
        else:
            # Add the sentence to the current chunk
            current_chunk.append(sentence)
            current_size += len(sentence) + 1
    
    # Don't forget the last chunk
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks


def get_url_type(url: str) -> str:
    if "youtube.com" in url or "youtu.be" in url: return "youtube"
    if "wikipedia.org" in url: return "wikipedia"
    return "webpage"


def extract_transcript_details(youtube_video_url):
    try:
        if "youtube.com" in youtube_video_url and "=" in youtube_video_url:
            video_id = youtube_video_url.split("=")[1]
            # Handle additional parameters after video ID
            if "&" in video_id:
                video_id = video_id.split("&")[0]
        elif "youtu.be" in youtube_video_url:
            video_id = youtube_video_url.split("/")[-1]
            # Handle additional parameters after video ID
            if "?" in video_id:
                video_id = video_id.split("?")[0]
        else:
            return None, None, "Invalid YouTube URL format"
            
        try:
            transcript_text = YouTubeTranscriptApi.get_transcript(video_id)
            transcript = ""
            for i in transcript_text:
                transcript += " " + i["text"]
            return transcript, video_id, None
        except Exception as te:
            # Try to get transcript with auto-translation if available
            try:
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                # Try to find manual transcripts first
                for transcript in transcript_list:
                    if not transcript.is_generated:
                        # Prefer manual transcripts
                        transcript_text = transcript.fetch()
                        break
                else:
                    # If no manual transcript found, use the first available
                    transcript_text = transcript_list[0].fetch()
                
                # Build the transcript text
                transcript = ""
                for i in transcript_text:
                    transcript += " " + i["text"]
                return transcript, video_id, None
            except:
                return None, None, f"Could not retrieve transcript for video ID: {video_id}. The video might not have captions or they might be disabled."
    except Exception as e:
        return None, None, f"Error extracting YouTube transcript: {str(e)}"


def extract_wikipedia_content(wikipedia_url):
    try:
        # Extract the title from the URL
        title_match = re.search(r'wikipedia\.org/wiki/(.+)', wikipedia_url)
        if not title_match:
            return None, None, "Invalid Wikipedia URL. Please provide a link in the format: https://en.wikipedia.org/wiki/Article_Title"
            
        title = title_match.group(1)
        title = title.replace('_', ' ')
        
        # Initialize Wikipedia API
        wiki_wiki = wikipediaapi.Wikipedia('WikiSummarizerApp/1.0', 'en')
        page = wiki_wiki.page(title)
        
        if not page.exists():
            return None, None, f"Wikipedia page '{title}' does not exist or could not be found."
            
        return page.text, title, None
    except Exception as e:
        return None, None, f"Error extracting Wikipedia content: {str(e)}"
    
    
def extract_webpage_content(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title = soup.title.string if soup.title else "No title found"
        
        # Remove script, style elements and comments
        for element in soup(['script', 'style', 'header', 'footer', 'nav', 'aside']):
            element.decompose()
            
        # Extract text from paragraphs, headings, and lists
        content_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'])
        
        content = []
        for element in content_elements:
            text = element.get_text(strip=True)
            if text and len(text) > 20:  # Filter out very short texts
                content.append(text)
                
        # Join all paragraphs with newlines
        full_text = "\n\n".join(content)
        
        # Get the webpage favicon or domain icon
        domain = urllib.parse.urlparse(url).netloc
        favicon_url = f"https://www.google.com/s2/favicons?domain={domain}&sz=64"
        
        return full_text, title, None
    except Exception as e:
        return None, None, f"Error extracting webpage content: {str(e)}"


def generate_groq_content(text: str, prompt: str, api_key: str, model: str="llama3-8b-8192") -> str:
    # Default to smaller model to avoid token limits
    try:
        resp = requests.post(
            GROQ_API_ENDPOINT,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": "Summarize."},
                    {"role": "user", "content": prompt+text}
                ],
                "temperature": 0.3,
                "max_tokens": 800  # Reduced to stay within limits
            }
        )
        if resp.status_code == 200: 
            return resp.json()["choices"][0]["message"]["content"]
        if resp.status_code == 429: 
            time.sleep(5)
            return generate_groq_content(text, prompt, api_key, model)
        if resp.status_code == 413:  # Request too large
            # If the request is too large, try to split it further or use a smaller model
            if model != "llama3-8b-8192":
                # Try with the smaller model
                return generate_groq_content(text, prompt, api_key, "llama3-8b-8192")
            elif len(text) > 2000:
                # If already using the smallest model and text is still too large, truncate
                return generate_groq_content(text[:2000], prompt + " (text was truncated due to size) ", api_key, model)
            else:
                return "Error: Content too large for API limits even after reduction attempts."
        return f"Error {resp.status_code}: {resp.text}"
    except Exception as e:
        return f"Error processing content: {str(e)}"


def process_large_content(text: str, utype: str, api_key: str) -> str:
    # Split into smaller chunks to avoid API limits
    chunks = split_into_chunks(text, max_chunk_size=2000)
    
    # Process each chunk separately
    partials = []
    for chunk in chunks:
        try:
            # Use the smaller model for chunk processing to reduce token usage
            summary = generate_groq_content(chunk, chunk_prompt, api_key, model="llama3-8b-8192")
            partials.append(summary)
        except Exception as e:
            # If a chunk fails, add a placeholder and continue
            partials.append(f"[Chunk processing error: {str(e)}]")
    
    # Combine chunk summaries
    combined = "\n\n--- SECTION ---\n\n".join(partials)
    
    # If the combined summaries are still too large, summarize recursively
    if len(combined) > 4000:
        # Split the combined summaries into chunks again
        summary_chunks = split_into_chunks(combined, max_chunk_size=2000)
        final_partials = []
        
        for chunk in summary_chunks:
            try:
                # Summarize each chunk of summaries
                final_summary = generate_groq_content(
                    chunk, 
                    "Further condense this summary section while preserving key information:", 
                    api_key, 
                    model="llama3-8b-8192"
                )
                final_partials.append(final_summary)
            except Exception as e:
                final_partials.append(f"[Summary processing error: {str(e)}]")
        
        # Join the final summaries
        final_combined = "\n\n".join(final_partials)
        
        # Generate the final summary with a prompt that asks for conciseness
        return generate_groq_content(
            final_combined, 
            final_prompts[utype] + "\n\nKeep your summary brief and within token limits:\n", 
            api_key,
            model="llama3-8b-8192"  # Use the smaller model for final summary to stay within limits
        )
    
    # If combined summaries are small enough, proceed as normal
    return generate_groq_content(combined, final_prompts[utype], api_key, model="llama3-8b-8192")


def summarize_content(url: str) -> dict:
    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not set"}

    utype = get_url_type(url)
    if utype == "youtube":
        content, title, err = extract_transcript_details(url)
    elif utype == "wikipedia":
        content, title, err = extract_wikipedia_content(url)
    else:
        content, title, err = extract_webpage_content(url)

    if err:
        return {"error": err}
    
    if not content:
        return {"error": f"Could not extract content from the {utype} URL"}

    # Always process content in chunks to avoid token limits
    try:
        summary = process_large_content(content, utype, GROQ_API_KEY)
        
        # If the summary is very short, it might indicate an error
        if len(summary) < 50 and ("error" in summary.lower() or "token" in summary.lower()):
            return {
                "type": utype,
                "title": title,
                "error": f"Failed to generate summary: {summary}",
                "partial_summary": "The content was processed but could not be fully summarized due to API limits."
            }
            
        return {
            "type": utype,
            "title": title,
            "summary": summary
        }
    except Exception as e:
        return {
            "type": utype,
            "title": title,
            "error": f"Error during summarization: {str(e)}",
            "content_length": len(content)
        }