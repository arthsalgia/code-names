import random
from schemas.game import Game
from schemas.player import TeamType
from engine import get_session

def start_turn():
    turn = random.choice([TeamType.red, TeamType.blue])
    update_game = Game(turn = turn)
    with get_session() as session:
        session.add(update_game)
        session.commit()

    return turn

def get_next_turn(curr_turn):

    if isinstance(curr_turn, str):
        curr_turn = TeamType(curr_turn)

    if curr_turn == TeamType.red:
        return TeamType.blue
    elif curr_turn == TeamType.blue:
        return TeamType.red
    else:
        raise Exception("Something went wrong with turn")