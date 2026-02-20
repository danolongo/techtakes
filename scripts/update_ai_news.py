import os
import json
import feedparser
from supabase import create_client, Client
from google import genai
from google.genai import types
from datetime import datetime
import asyncio
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv() # fallbacks to .env


# Configuration
RSS_FEEDS = [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.theverge.com/rss/ai/index.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/ArtificialIntelligence.xml"
    # Add more as needed
]

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.")
    exit(1)

if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY must be set. Please check your .env.local file.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GOOGLE_API_KEY)

def fetch_news():
    articles = []
    print("Fetching news from RSS feeds...")
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:5]:  # Top 5 from each
                articles.append({
                    "title": entry.title,
                    "link": entry.link,
                    "summary": entry.get("summary", ""),
                    "published": entry.get("published", datetime.now().isoformat()),
                    "source": feed.feed.title
                })
        except Exception as e:
            print(f"Error fetching {feed_url}: {e}")
    return articles

def generate_summary(articles):
    print("Generating summary with Google GenAI...")
    
    # Prepare prompt
    articles_text = "\n\n".join([f"Title: {a['title']}\nSource: {a['source']}\nSummary: {a['summary']}" for a in articles])
    
    prompt = f"""
    You are an AI news curator. Below is a list of recent AI news articles.
    Identify the single most important or "trending" story from this list.
    Create a "tl;dr" summary of this stories.
    
    Format the output as a JSON object with the following keys:
    - "headline": A catchy, short headline for the trending topic.
    - "summary": A 2-3 sentence summary of the news.
    - "key_points": An array of 3 bullet points.
    - "sources": An array of relevant links from the provided articles.
    
    Articles:
    {articles_text}
    """
    
    import time
    from google.genai.errors import ClientError

    models_to_try = ["gemini-flash-latest", "gemini-pro-latest", "gemini-2.0-flash-lite-001"]
    
    for model in models_to_try:
        print(f"Trying model: {model}")
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
        except ClientError as e:
            if e.code == 429:
                print(f"Rate limited on {model}. Waiting 40s...")
                time.sleep(40)
                continue
            else:
                print(f"Error with {model}: {e}")
                continue
    
    print("Failed to generate summary with all models.")
    return None

def save_to_supabase(data):
    print("Saving to Supabase...")
    try:
        response = supabase.table("daily_ai_news").insert({
            "summary": data["summary"], # Saving the main summary text
            "sources": data # Saving the full JSON object including headline, key_points, sources
        }).execute()
        print("Successfully saved to Supabase.")
    except Exception as e:
        print(f"Error saving to Supabase: {e}")

def main():
    articles = fetch_news()
    if not articles:
        print("No articles found.")
        return

    # List models for debugging
    try:
        print("Listing available models...")
        for m in client.models.list(config={"page_size": 100}):
            print(f"Model: {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")

    summary_data = generate_summary(articles)
    if summary_data:
        save_to_supabase(summary_data)

if __name__ == "__main__":
    main()
