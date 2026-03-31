from pydantic import BaseModel
from models.player import Player
from schemas.team import TeamType
from models.card import Card

class Board(BaseModel):
    cards : dict[str, str]

    red_spy_master : Player
    blue_spy_master : Player

    red_field_operatives : list[Player]
    blue_field_operatives : list[Player]

    turn : TeamType

    