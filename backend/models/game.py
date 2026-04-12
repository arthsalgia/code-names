from pydantic import BaseModel
from ..schemas.team import TeamType

class StartGameResponse(BaseModel):
    game_id : str
    turn : TeamType