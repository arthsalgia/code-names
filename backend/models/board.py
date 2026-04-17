from pydantic import BaseModel
from ..schemas.team import TeamType
from .player import Player
from .card import Card

class Board(BaseModel):
    cards : dict[str, str]

    red_spy_master : Player
    blue_spy_master : Player

    red_field_operatives : list[Player]
    blue_field_operatives : list[Player]

    turn : TeamType

    