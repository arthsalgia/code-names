import requests
import json
import httpx
import traceback

from fastapi import HTTPException, status, Query
from ..core.connection_manager import manager
from ..core.constants import GOOGLE_STUDIO_SSK
from ..services.AI import format_AI_hint_input
from ..app import app


async def call_gemini(url, params, payload, retries=3):
    async with httpx.AsyncClient() as client:
        for i in range(retries):
            response = await client.post(url, params=params, json=payload)

            if response.status_code == 200:
                return response.json()

            if response.status_code in [503, 429]:
                import asyncio
                await asyncio.sleep(2 ** i)
                continue
            print("GEMINI ERROR BODY:", response.text)  
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
    cards_parsed = json.loads(cards)
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": format_AI_hint_input(team, cards_parsed)
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
    try:
        await manager.broadcast(game_id, {
            "type": "AI_THINKING",
            "payload": {"team": team}
        })

        data = await call_gemini(url, params, payload, 3)

        text = data["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(text)

        response = {
                "word": parsed["word"],
                "number_of_guesses": parsed["number_of_guesses"],
                "team": team
            }
        await manager.broadcast(game_id, {
            "type": "AI_HINT",
            "payload": response
        })

    except Exception as e:
        print("EXCEPTION TYPE:", type(e))
        print("EXCEPTION TRACEBACK:", traceback.format_exc())
        await manager.broadcast(game_id, {
            "type": "AI_HINT_FAILED",
            "payload": {"team": team}
        })
        raise HTTPException(status_code=500, detail=str(e))

    
    return response




