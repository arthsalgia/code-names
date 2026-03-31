from pydantic import BaseModel
from schemas.team import TeamType

class CurrentTurnResponse(BaseModel):
    turn : TeamType