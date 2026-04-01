from fastapi import HTTPException
from ..schemas.game import Game
from ..engine import get_session
from ..models.turn import CurrentTurnResponse
from ..app import app

@app.get("/current-turn", response_model=CurrentTurnResponse)
def current_turn(game_id):
    with get_session() as session:
        curr_turn = session.query(Game.turn).filter_by(id=game_id).scalar()

        if curr_turn is None:
            raise HTTPException(status_code=404, detail="Game not found")
    
    return {"turn" : curr_turn}