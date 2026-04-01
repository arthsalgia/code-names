from schemas.card import Card
from engine import get_session
from fastapi import HTTPException, status, Query
from app import app

@app.get("/get-cards")
def get_cards(game_id: int = Query(..., description="ID of the game")):

    with get_session() as session:
        cards = session.query(
            Card.word,
            Card.card_type,
            Card.guessed
        ).filter_by(game_id=game_id).all()

        if not cards:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cards not found"
            )
    
    response = {}
    for word, card_type, guessed in cards:
        response[word] = {"card_type": card_type.value, "guessed" : guessed}
    

    return response