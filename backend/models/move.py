from pydantic import BaseModel
from ..schemas.team import TeamType
from ..schemas.player import Role

class PostMove(BaseModel):
    game_id : str
    team : TeamType
    role : Role
    word : str

class PostMoveResponse(BaseModel):
    turn : str
    guessed : bool
    winner : TeamType | None = None
    