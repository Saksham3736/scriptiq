import os
import sys
sys.path.insert(0, os.path.abspath('.'))

import config
from google import genai

client = genai.Client(api_key=config.GEMINI_API_KEY)

candidates = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"]

for model_name in candidates:
    try:
        res = client.models.generate_content(
            model=model_name,
            contents="Confirm audio model readiness."
        )
        print(f"SUCCESS: Model '{model_name}' is available! Response:", res.text[:40])
    except Exception as e:
        print(f"FAILED: Model '{model_name}':", e)
