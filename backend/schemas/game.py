from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum
from ..base import Base
from .team import TeamType

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .card import Card
    from .player import Player

class Game(Base):
    __tablename__ = "game"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    winner: Mapped[TeamType | None] = mapped_column(SQLEnum(TeamType), nullable=True, index=True)

    turn: Mapped[TeamType | None]  = mapped_column(SQLEnum(TeamType), nullable=True)
    cards: Mapped[list["Card"]] = relationship(
        "Card",
        back_populates="game",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    players: Mapped[list["Player"]] = relationship(
        "Player",
        back_populates="game",
        lazy="selectin",
        cascade="all, delete-orphan"
    )