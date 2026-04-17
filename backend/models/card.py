from pydantic import BaseModel
from typing import Literal

class Card(BaseModel):
    word: str
    card_type: Literal["red", "blue", "neutral", "assassin"]

    model_config = {
        "from_attributes": True
    }
