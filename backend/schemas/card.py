import enum

from sqlalchemy import String, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum
from base import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .game import Game



class CardType(enum.Enum):
    red = "red"
    blue = "blue"
    assassin = "assassin" 
    neutral = "neutral"

class Card(Base):
    __tablename__ = "card"

    __table_args__ = (
        UniqueConstraint("game_id", "word"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("game.id"), nullable=False, index=True)

    word: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    card_type: Mapped[CardType] = mapped_column(SQLEnum(CardType), nullable=False, index=True)

    guessed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    game: Mapped["Game"] = relationship(
        "Game",
        back_populates="cards",
        lazy="selectin"
    )