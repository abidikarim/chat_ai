import requests
from .models import AIModel
from decouple import config

OLLAMA_HOST = config("OLLAMA_HOST")

import requests
from .models import AIModel
from decouple import config
import logging

logger = logging.getLogger(__name__)

OLLAMA_HOST = config("OLLAMA_HOST")

def call_model_ai(user_message: str = None, lang: str = "en", selected_model: AIModel = AIModel.FALCON3, history: list = None, isSummary: bool = False) -> str | None:
    if history is None:
        history = []

    if isSummary and history:
        messages_to_send = history
    else:
        if lang.lower() == "ar":
            content = f"أجب على السؤال التالي باللغة العربية: {user_message}"
        else:
            content = f"Answer the following question in English: {user_message}"
        messages_to_send = history + [{'role': 'user', 'content': content}]

    payload = {
        'model': selected_model,
        'messages': messages_to_send,
        'stream': False
    }

    try:
        response = requests.post(OLLAMA_HOST, json=payload)
        response.raise_for_status()
        response_data = response.json()
        return response_data["message"]["content"]
    
    except Exception as e:
        logger.exception(f"AI model call failed: {e}")
        return None
