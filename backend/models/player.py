from pydantic import BaseModel
from ..schemas.team import TeamType
from ..schemas.player import Role

class Player(BaseModel):
    name : str
    team : TeamType

class CreatePlayerData(BaseModel):
    name : str
    role : Role
    host : bool
    team : TeamType
    game_id : str | None = None

class CreatePlayerResponse(BaseModel):
    id : int
