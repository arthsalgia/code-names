import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import './startGame.css'
import addPlayerApi from '../../apis/addPlayer';
import getPlayer from '../../apis/getPlayer';
import getPlayers from '../../apis/getPlayers';

export default function StartGame() {
  const { gameId } = useParams();
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState({team: '', role: ''});

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [playerId, setPlayerId] = useState(() => localStorage.getItem("playerId"));

  function GoToGame() {
    navigate(`/play-game/${gameId}`);
  }

  function handleJoin(team, role) {
    if (gameId) {
      return;
    }
    setSelected({ team, role });
  }
  
  async function handleJoinGame() {
    if (!username.trim() || !selected.team) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const playerId = await addPlayerApi({
        name: username,
        role: selected.role,
        host: false,
        team: selected.team,
        gameId: gameId
      });

      localStorage.setItem("playerId", playerId);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function checkHost() {
      if (!playerId || !gameId) return;

      try {
        const player = await getPlayer(gameId, playerId);
        setIsHost(player.host === true);
      } catch (err) {
        console.error(err);
      }
    }

    checkHost();
  }, [gameId, playerId]);

  
  return (
    <div className={`root-container ${loading ? "locked" : ""}`}>

      <div className='team-column'>
        <h2 className='team-title red-title'>Red Team</h2>
        <div className='team-card red-card'>
          <div className='team-card-name-text'><span>luciana</span></div>
          <button className= {`join-btn ${selected.role === 'spymaster_red' ? "joined" : "red-btn"}`} 
            onClick={() => handleJoin('red', 'spymaster_red')}
          >
            {selected.role === 'spymaster_red' ? 'Joined' : 'Join'}
          </button>
          <div className='team-card-role-text'><span>Spymaster</span></div>
        </div>
        <div className='team-card red-card'>
          <span>Operative</span>
          <button className= {`join-btn ${selected.role === 'operative_red' ? "joined" : "red-btn"}`} 
            onClick={() => handleJoin('red', 'operative_red')}
          >
            {selected.role === 'operative_red' ? 'Joined' : 'Join'}
          </button>
        </div>
      </div>

      <div className="start-game">  
        <h1>Join game</h1>

      {!isHost && (
        <div className="start-card">
          {!isHost && (<div className="input-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              />
            <label className="label">Username</label>
            <div className="underline"></div>
          </div>)}
        </div>)}
        
        {isHost && (
          <button className='button' onClick={() => GoToGame()}>
            <div className='game-id-text'>{gameId}</div>
          </button>
        )}

        {loading && <div className="loader"></div>}
        
      </div>

      <div className='team-column'>
        <h2 className='team-title blue-title'>Blue Team</h2>
        <div className='team-card blue-card'>
          <span>Spymaster</span>
          <button className= {`join-btn ${selected.role === 'spymaster_blue' ? "joined" : "blue-btn"}`} 
            onClick={() => handleJoin('blue', 'spymaster_blue')}
          >
            {selected.role === 'spymaster_blue' ? 'Joined' : 'Join'}
          </button>
        </div>
        <div className='team-card blue-card'>
          <span>Operative</span>
          <button className= {`join-btn ${selected.role === 'operative_blue' ? "joined" : "blue-btn"}`} 
            onClick={() => handleJoin('blue', 'operative_blue')}
          >
            {selected.role === 'operative_blue' ? 'Joined' : 'Join'}
          </button>
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