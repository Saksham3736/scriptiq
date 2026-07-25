import os
import sys
sys.path.insert(0, os.path.abspath('.'))

import config
from google import genai

client = genai.Client(api_key=config.GEMINI_API_KEY)

print("Listing available models for project API key...")
try:
    models = list(client.models.list())
    for m in models:
        print("Model:", m.name, "-> Supported Methods:", getattr(m, 'supported_generation_methods', []))
except Exception as e:
    print("Error listing models:", e)
