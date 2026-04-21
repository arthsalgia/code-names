from pydantic import BaseModel
from ..schemas.team import TeamType
from ..schemas.player import Role

class Player(BaseModel):
    name : str
    team : TeamType

class CreatePlayerData(BaseModel):
    name : str
    role : Role | None = None
    host : bool = False
    team : TeamType | None = None
    game_id : str

class CreatePlayerResponse(BaseModel):
    id : int

