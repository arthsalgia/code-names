import enum
from sqlalchemy import String, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum
from ..base import Base
from .team import TeamType

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .game import Game

class Role(enum.Enum):

    spymaster_red = "spymaster_red"
    spymaster_blue = "spymaster_blue"

    operative_red = "operative_red"
    operative_blue = "operative_blue"


class Player(Base):
    __tablename__ = "player"
    __table_args__ = (
        UniqueConstraint("game_id", "name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    game_id: Mapped[int] = mapped_column(ForeignKey("game.id"), nullable=False, index=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    team: Mapped[TeamType] = mapped_column(SQLEnum(TeamType), nullable=False, index=True)

    role: Mapped[Role] = mapped_column(SQLEnum(Role), nullable=False, index=True)

    host: Mapped[bool] = mapped_column(Boolean, nullable=False)

    game: Mapped["Game"] = relationship(
    "Game",
    back_populates="players",
    lazy="selectin"
    )