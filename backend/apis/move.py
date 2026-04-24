from fastapi import HTTPException, status
from ..app import app
from ..models.move import PostMove, PostMoveResponse
from ..schemas.card import Card, CardType
from ..schemas.game import Game
from ..schemas.player import Role
from ..schemas.team import TeamType
from ..services.end_game import end_game
from ..services.curr_turn import current_turn
from ..services.turn import get_next_turn
from ..engine import get_session
from ..core.connection_manager import manager

@app.post("/make-guess", response_model=PostMoveResponse)
async def make_guess(guess: PostMove):
    team = TeamType(guess.team)
    word = guess.word.lower()
    role = guess.role
    game_id = guess.game_id

    curr_turn = TeamType(current_turn(game_id))
    
    next_turn = get_next_turn(curr_turn)

    if role not in (Role.operative_blue, Role.operative_red):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only operatives can make guesses"
        )
    
    if team != curr_turn:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must be the teams turn to guess"
        )

    with get_session() as session:

        game = session.query(Game).filter_by(id=game_id).first()
        
        if not game:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Game does not exist"
            )
        

        guessed_card = session.query(Card).filter_by(word=word, game_id=game_id).first()
        if guessed_card == None:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"{word} not in card list"
                )

        guessed = False
        if guessed_card.card_type in (CardType.red, CardType.blue):
            if guessed_card.guessed == True:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Card alredy gussed"
                )
            
            guessed = True
            guessed_card.guessed = True

        winner = end_game(session, game_id, guessed_card.card_type, team)
        game.turn = next_turn
        session.commit()
    
    payload = {
        "turn" : next_turn,
        "guessed" : guessed,
        "winner" : winner
            }
    
    await manager.broadcast(game_id, {
        "type": "GUESS",
        "payload": payload
    })
    
    return payload

