import requests
import time

from fastapi import HTTPException, status, Query
from ..core.connection_manager import manager
from ..core.constants import GOOGLE_STUDIO_SSK
from ..services.AI import format_AI_hint_input
from ..app import app


def call_gemini(url, params, payload, retries=3):
    for i in range(retries):
        response = requests.post(url, params=params, json=payload)

        if response.status_code == 200:
            return response.json()

        if response.status_code in [503, 429]:
            time.sleep(2 ** i) 
            continue
        response.raise_for_status()

    raise Exception("Gemini API failed after retries")

@app.get("/get-AI-hint")
async def get_AI_hint(game_id: str = Query(...), cards: str = Query(...), team: str = Query(...)):
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.5-flash:generateContent"
    )

    params = {"key": GOOGLE_STUDIO_SSK}

    if not cards or cards is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide cards"
        )
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": format_AI_hint_input(team, cards)
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "word": {
                        "type": "STRING"
                    },
                    "number_of_guesses": {
                        "type": "INTEGER"
                    }
                },
                "required": [
                    "word",
                    "number_of_guesses"
                ]
            }
        }
    }


    data = call_gemini(url, params, payload, 3)

    text = data["candidates"][0]["content"]["parts"][0]["text"]

    
    await manager.broadcast(game_id, {
        "type": "AI_HINT",
        "payload": {text}
    })
    
    return text




