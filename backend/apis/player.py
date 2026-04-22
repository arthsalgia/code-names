from fastapi import HTTPException, status, Query
from ..engine import get_session
from ..models.player import CreatePlayerData, CreatePlayerResponse, Role
from ..schemas.player import Player, TeamType

from ..app import app

@app.post("/add-player", response_model=CreatePlayerResponse)
def add_player(player_data: CreatePlayerData):
    new_name = player_data.name
    new_team = TeamType(player_data.team) if player_data.team else None
    new_role = Role(player_data.role) if player_data.role else None
    new_host = player_data.host
    new_game_id = player_data.game_id


    with get_session() as session:
        players = session.query(Player).filter_by(game_id=new_game_id).all()

        if len(players) >= 4:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cant add more than 4 players"
            )
        
        num_red_teams = 0
        num_blue_teams = 0
        num_red_spymaster = 0
        num_blue_spymaster = 0

        for player in players:
            if player.host and new_host:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only one host per game"
                )

            if player.name == new_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Name already taken"
                )

            if player.team == TeamType.red:
                num_red_teams += 1
            elif player.team == TeamType.blue:
                num_blue_teams += 1

            if player.role == Role.spymaster_red:
                num_red_spymaster += 1
            elif player.role == Role.spymaster_blue:
                num_blue_spymaster += 1

        
        if (num_blue_teams >= 2 and new_team == TeamType.blue) or (num_red_teams >= 2 and new_team == TeamType.red):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Too many players for team {new_team.value}"
            )
        
        if (num_red_spymaster >= 1 and new_role == Role.spymaster_red) or (num_blue_spymaster >= 1 and new_role == Role.spymaster_blue):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Each team can only have one spymaster"
            )

        new_player = Player(name=new_name, team=new_team, role=new_role, host=new_host, game_id=new_game_id)
        session.add(new_player)
        session.commit()
        session.refresh(new_player)

        return {"id": new_player.id}
    
@app.get("/get-players")
def get_players(game_id: str = Query(..., description="ID of the game")):

    with get_session() as session:
        players_data = session.query(Player).filter_by(game_id=game_id).all()
        
        players = []

        for player in players_data:
            players.append({
                "id": player.id,
                "name": player.name,
                "team": player.team.value if player.team else None,
                "role": player.role.value if player.role else None,
                "host": player.host
            })
        return players
    
@app.get("/games/{game_id}/player/{player_id}")
def get_player(game_id: str, player_id: int):
    with get_session() as session:
        res = session.query(Player).filter_by(id=player_id, game_id=game_id).first()

        if not res:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Player with this id doesnt not exist for this game"
            )
        
        player_data = {
            "name": res.name,
            "team": res.team.value if res.team else None,
            "role": res.role.value if res.role else None,
            "host": res.host,
        }

    return player_data
 

    