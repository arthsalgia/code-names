# Codenames report

## Description 

This is a webbased implimentation of the game Codenames. The website allows multiple players to join a shared lobby, select roles and teams. The players are able to join in real time and all changes are reflected on other screens using websockets. The system uses a react based frontend with a python based backend and a supabase posgres db (more on all of this later).

#### If you want to know how to play this game go to the [Codenames](https://codenames.game/) website

---

## Approach and logic used

### 1: Frontend (React)
- The frontend is uses the framework React to build the UI the players interact with. 
- It allows players to create and join games, select roles and teams, and just play the game.
- useState and useEffect are some of the react hooks that are used to store data about the local state of the game. 
- The frontend is currently hosted locally, and is responsible for using the REST APIs and websockets for real time updates.

### 2: Backend (Python)
- The backend uses FastApi which is a web framework for building python apis. 
- The apis created allow the system to create/start a game, add players with roles and teams, generate cards, handle moves and update players. 
- Impliments the connection manager and websockets for real time communication with the frontend
- The connection manager tracks active users per game_id and broad casts messages to all the connected clients
### 3: Role Based Authorization 
- There is a lightweight RBAC modle to manage player permissions within a game session
- Both the frontend and the backend are used to enforce role contraints 
- Each player is assigned a role and a team
- A special host role is used to control creating and starting the game

### 4: Database (Supabase PosgreSQL)
- The game uses [Supabase](https://supabase.com/) to host the PosgreSQL db 
- Stores persistent data like meta data about the game, players (including id names role team host status), game cards (including the word, type, if its guessed)
- The backend uses [SQLalchemy](https://www.sqlalchemy.org/) which is a python SQL toolkit and ORM to interact with the DB
### 5: Deployment
- The fastAPI backend is publicly hosted on [Render](https://render.com/)
- The frontend commuinicates with the backend via a render provided url
- Currently the frontend is locally hosted but I am planning on using [Vercel](https://vercel.com/) to host the frontend later on

---
## Data Structures used
### Frontend - 
#### Arrays: <br>
There are many uses of arrays in the project <br>
For example players are stored like this:
``` js
{
  id: "string",
  name: "string",
  team: "red" | "blue",
  role: "spymaster_red" | "operative_blue" | etc.,
  host: boolean
}
```
#### State Objects: <br>
Selected stores currently selected team and role for a player
```js
{ team: "red", role: "spymaster_red" }
```
- Local storage: <br> 
used to hold persistent data about players and the game per gameId
#### Websocket Message Objects: <br>
Websockets are used to maintain real time synchronization between all connected clients. Events like players joining and the game starting are broadcast through stuctured messages like below. This removes the need for constant polling
``` js
{
  type: "PLAYERS_ADD" | "HOST_UPDATE" | "GAME_START",
  payload: {...}
}
```
### Backend/DB - 
- SQLalchemy models: <br>
#### For sending post bodies
```python
class CreatePlayerData(BaseModel):
    name : str
    role : Role | None = None
    host : bool = False
    team : TeamType | None = None
    game_id : str
```
#### Creating DB tables
```python
class Player(Base):
    __tablename__ = "player"
    __table_args__ = (
        UniqueConstraint("game_id", "name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    game_id: Mapped[str] = mapped_column(ForeignKey("game.id"), nullable=False, index=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    team: Mapped[TeamType] = mapped_column(SQLEnum(TeamType), nullable=True, index=True)

    role: Mapped[Role] = mapped_column(SQLEnum(Role), nullable=True, index=True)

    host: Mapped[bool] = mapped_column(Boolean, nullable=False)

    game: Mapped["Game"] = relationship(
    "Game",
    back_populates="players",
    lazy="selectin"
    )
```
#### Query results
- SQLAlchemy returns row objects that are converted into Python dictionaries before sending to frontend
```python
{
  "word": {
    "card_type": "red",
    "guessed": False
  }
}
```

## Challenges faced
### State Synchronization
Keeping the frontend consistent with the backend was difficult, before I was not using websockets so I had to keep sending api requests which is always bad practice. I solved this by implimenting websockets (yippie!)
### React
As this was my first time coding with react, I had to spend a lot of time understanding the different functions and hooks used. 

## Future Improvements
### Incomplete 
- While it is possible to play the game via the render docs page, that is no fun<br><br>
- Im currently working on the actual gameplay in the frontend 
### UI improvements
- I want to add a responsive background and improve the aesthetics of the game <br><br>
- Im currently using open sourced elements from [uiverse](https://uiverse.io) like some of the buttons and loaders, but I want to later design this myself 

### This game was made by Arth Salgia (me)
#### This was my first time using the react framework so I apologise about the strange commit messages and other things
#### If you have any questions or comments about this page please reach out to me on my email arthsalgia@gmail.com

