from ..schemas.game import Game
from ..engine import get_session

def current_turn(game_id):
    with get_session() as session:
        row = session.query(Game.turn).filter_by(id=game_id).first()

        if row:
            curr_turn = row[0] 
            return curr_turn.value
        return None