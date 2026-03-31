import random

from fastapi import HTTPException, status
from engine import get_session
from services.board import create_board
from services.words import get_words
from services.turn import start_turn
from schemas.game import Game
from models.game import StartGameResponse
from app import app


@app.post("/start-game", response_model=StartGameResponse)
def start_game():
    turn = start_turn()
    words = get_words()

    if words == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="word list not generated"
        )
    
    with get_session() as session:

        new_game = Game(winner=None, turn=turn)
        session.add(new_game)
        session.flush()
        game_id = new_game.id

        cards = create_board(game_id, turn, words)
        new_game.cards = cards

        return {"game_id":game_id, "turn": turn}

    