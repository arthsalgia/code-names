from fastapi import HTTPException, status
from sqlalchemy import func
from ..schemas.card import Card, CardType
from ..schemas.game import Game
from ..schemas.team import TeamType

def end_game(session, game_id, card_type, team):

    
    game = session.query(Game).filter_by(id=game_id).first()

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if game.winner is not None:
        return game.winner
    else:
        winner = None
    
    if card_type == CardType.assassin:
        if team == TeamType.red:
            game.winner = TeamType.blue
            return TeamType.blue
        elif team == TeamType.blue:
            game.winner = TeamType.red
            return TeamType.red
    
    total_red_cards = session.query(Card).filter_by(
        card_type=CardType.red,
        game_id=game_id
        ).count()
    
    if total_red_cards == 9:
        total_blue_cards = 8
    elif total_red_cards == 8:
        total_blue_cards = 9
    else:
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail=f"Different amount of red cards than expected: {total_red_cards}"
        )

    results = session.query(
            Card.card_type,
            func.count(Card.id)
        ).filter_by(
            game_id=game_id,
            guessed=True
        ).group_by(Card.card_type).all()

    counts = {}
    for ctype, count in results:
        counts[ctype] = count

    blue_cards = counts.get(CardType.blue, 0)
    red_cards = counts.get(CardType.red, 0)
    
    if total_red_cards == red_cards:
        game.winner = TeamType.red
        winner = TeamType.red
    elif total_blue_cards == blue_cards:
        game.winner = TeamType.blue
        winner = TeamType.blue

    return winner