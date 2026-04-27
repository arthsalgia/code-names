from fastapi import HTTPException, status, Query
from ..services.board import create_board
from ..services.words import get_words
from ..services.turn import start_turn
from ..schemas.game import Game
from ..services.game_id import new_game_id
from ..models.game import StartGameResponse
from ..engine import get_session
from ..core.connection_manager import manager
from ..app import app


@app.post("/start-game", response_model=StartGameResponse)
def start_game():
    turn = start_turn()
    words = get_words()

    if words == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="word list not generated"
        )
    
    with get_session() as session:

        game_id = new_game_id(session)
        new_game = Game(id=game_id, winner=None, turn=turn)
        session.add(new_game)
        session.flush()

        cards = create_board(game_id, turn, words)
        new_game.cards = cards

        session.commit()
        session.refresh(new_game)

        return {"game_id":game_id, "turn": turn}

@app.get("/game-exists")
def game_exists(game_id: str = Query(..., description="ID of the game")):
    with get_session() as session:

        game = session.query(Game).filter_by(id=game_id).all()

        if game:
            return True
        return False
    
@app.post("/host-start-game")
async def host_start_game(game_id: str):
    await manager.broadcast(game_id, {
        "type": "GAME_START"
    })
    return {"status": "ok"}