import requests

from fastapi import HTTPException, status, Query
from ..core.connection_manager import manager
from ..core.constants import GOOGLE_STUDIO_SSK
from ..services.AI import format_AI_hint_input
from ..app import app

@app.get("/get-AI-hint")
async def get_AI_hint(game_id: str = Query(...), cards: str = Query(...), team: str = Query(...)):
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.5-flash:generateContent"
    )

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

    response = requests.post(
        f"{url}?key={GOOGLE_STUDIO_SSK}",
        json=payload,
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    text = data["candidates"][0]["content"]["parts"][0]["text"]

    return {"data" : data, "response" : text}
    
    await manager.broadcast(game_id, {
        "type": "AI_HINT",
        "payload": {"turn": ''}
    })
    return {"status": "ok"}




