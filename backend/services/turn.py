import random
from ..schemas.player import TeamType

def start_turn() -> TeamType:
    turn = random.choice([TeamType.red, TeamType.blue])
    return turn

def get_next_turn(curr_turn) -> TeamType:

    if isinstance(curr_turn, str):
        curr_turn = TeamType(curr_turn)

    if curr_turn == TeamType.red:
        return TeamType.blue
    elif curr_turn == TeamType.blue:
        return TeamType.red
    else:
        raise Exception("Something went wrong with turn")