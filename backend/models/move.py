from pydantic import BaseModel
from ..schemas.team import TeamType
from ..schemas.player import Role

class PostMove(BaseModel):
    game_id : str
    team : TeamType
    role : Role
    word : str

class PostMoveResponse(BaseModel):
    guessed : bool
    winner : str | None = None
    word : str

    