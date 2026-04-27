import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import './startGame.css'
import addPlayerApi from '../../apis/addPlayer';
import getPlayerApi from '../../apis/getPlayer';
import getAllPlayersApi from '../../apis/getPlayers';
import updateHostApi from '../../apis/updateHost';

export default function StartGame() {
  const { gameId } = useParams();
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState({team: '', role: ''});

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState(() => localStorage.getItem(`playerId_${gameId}`));

  const [addPlayerLoading, setAddPlayerLoading] = useState(false);
  const [getPlayerLoading, setGetPlayerLoading] = useState(false);

  const [currPlayerJoined, setCurrPlayerJoined] = useState(false);
  const [hostJoined, setHostJoined] = useState(false);

  function GoToGame() {
    navigate(`/play-game/${gameId}`);
  }

  function handleJoin(team, role) {
    if (!gameId) return;
    
    setSelected({ team, role });
  } 

  function getPlayer(team, role) {
    return players.find(p => p.team === team && p.role === role);
  }
  
  async function handleHostJoinGame() {
    if (!selected.team || !selected.role) return;
    
    setAddPlayerLoading(true);

    try {
      await updateHostApi({
      id: playerId,
      team: selected.team,
      role: selected.role,
      gameId: gameId
    });


      setHostJoined(true);
    } catch (err) {
      console.error(err);
    }
    finally {
      setAddPlayerLoading(false);
    }
  }

  async function handleJoinGame() {
    if (!username.trim() || !selected.team) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    setAddPlayerLoading(true);

    try {
      const playerId = await addPlayerApi({
        name: username,
        role: selected.role,
        host: false,
        team: selected.team,
        gameId: gameId
      });

      localStorage.setItem(`playerId_${gameId}`, playerId);
      setPlayerId(playerId);

    } catch (err) {
      console.error(err);
    } finally {
      setAddPlayerLoading(false);
      setCurrPlayerJoined(true);
    }
  }

  useEffect(() => {
    async function checkHost() {
      if (!gameId) return;

      const playerId = localStorage.getItem(`playerId_${gameId}`);

      if (!playerId) return;

      setGetPlayerLoading(true);

      try {
        const player = await getPlayerApi(gameId, playerId);
        setIsHost(player.host === true);
      } catch (err) {
          console.error(err);
      } finally {
          setGetPlayerLoading(false);
      }
    }

    checkHost();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const ws = new WebSocket(`wss://arthsalgia-codenames.onrender.com/ws/${gameId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "PLAYERS_ADD":
          const formatted = data.payload.map(player => ({
            id: player.id,
            name: player.name,
            role: player.role,
            team: player.team,
            host: player.host
          }));

          setPlayers(formatted);
          break;
        
        case "HOST_UPDATE":
        setPlayers(prev =>
          prev.map(p =>
            p.id === data.payload.id
              ? {
                  ... p,
                  role: data.payload.role,
                  team: data.payload.team
                }
              : p
          )
        );
        const playerFormatted = data.payload.map(player => ({
          id: player.id,
          name: player.name,
          role: player.role,
          team: player.team,
          host: player.host
          }));

        setPlayers(playerFormatted);

        break;
            }
    };

    return () => ws.close();
}, [gameId]);

  
  return (
    <div className={`root-container ${addPlayerLoading || getPlayerLoading ? "locked" : ""}`}>

      <div className='team-column'>
        <h2 className='team-title red-title'>Red Team</h2>
        <div className='team-card red-card'>
          <div className='team-card-name-text'><span>{getPlayer('red', 'spymaster_red')?.name || ''}</span></div>
          {!(getPlayer('red', 'spymaster_red') || hostJoined || currPlayerJoined) && (
            <button className= {`join-btn ${selected.role === 'spymaster_red' ? "joined" : "red-btn"}`} 
              onClick={() => handleJoin('red', 'spymaster_red')}
            >
              {selected.role === 'spymaster_red' ? 'Joined' : 'Join'}
            </button>
          )}
          <div className='team-card-role-text'><span>Spymaster</span></div>
        </div>
        <div className='team-card red-card'>
          <div className='team-card-name-text'><span>{getPlayer('red', 'operative_red')?.name || ''}</span></div>
          {!(getPlayer('red', 'operative_red') || hostJoined || currPlayerJoined) && (
            <button className= {`join-btn ${selected.role === 'operative_red' ? "joined" : "red-btn"}`} 
              onClick={() => handleJoin('red', 'operative_red')}
            >
              {selected.role === 'operative_red' ? 'Joined' : 'Join'}
            </button>
          )}
          <div className='team-card-role-text'><span>Operative</span></div>
        </div>
      </div>

      <div className="start-game">  
        <h1>Join game</h1>

        {!isHost && !currPlayerJoined && (
          <div className="start-card">
            <div className="input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
              <label className="label">Username</label>
              <div className="underline"></div>
            </div>
          </div>)}

        {!isHost && !currPlayerJoined && (
          <button className='button' onClick={() => handleJoinGame()}>
            <div><span>Join Game</span></div>
          </button>
        )}
          
        {isHost && !hostJoined && (
          <button className='button' onClick={() => handleHostJoinGame()}>
            <div><span>Join Game</span></div>
          </button>
        )}

        {isHost && (
          <button className='button' onClick={() => GoToGame()}>
            <div><span>Play game</span></div>
          </button>
        )}

        {(addPlayerLoading || getPlayerLoading) && <div className="loader"></div>}
        
      </div>

      <div className='team-column'>
        <h2 className='team-title blue-title'>Blue Team</h2>
        <div className='team-card blue-card'>
          <div className='team-card-name-text'><span>{getPlayer('blue', 'spymaster_blue')?.name || ''}</span></div>
          {!(getPlayer('blue', 'spymaster_blue') || hostJoined || currPlayerJoined) && (
            <button className= {`join-btn ${selected.role === 'spymaster_blue' ? "joined" : "blue-btn"}`} 
              onClick={() => handleJoin('blue', 'spymaster_blue')}
              >
              {selected.role === 'spymaster_blue' ? 'Joined' : 'Join'}
            </button>
          )}
          <div className='team-card-role-text'><span>Spymaster</span></div>
        </div>
        <div className='team-card blue-card'>
          <div className='team-card-name-text'><span>{getPlayer('blue', 'operative_blue')?.name || ''}</span></div>
          {!(getPlayer('blue', 'operative_blue') || hostJoined || currPlayerJoined) && (
            <button className= {`join-btn ${selected.role === 'operative_blue' ? "joined" : "blue-btn"}`} 
              onClick={() => handleJoin('blue', 'operative_blue')}
              >
              {selected.role === 'operative_blue' ? 'Joined' : 'Join'}
            </button>
          )}
          <div className='team-card-role-text'><span>Operative</span></div>
        </div>
      </div>
        
        
        {error && (
          <div className="error">
            <span className="error-message">* Username and team both required</span>
          </div>
        )}

    </div>
  );
}