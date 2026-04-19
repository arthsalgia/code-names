import { useState } from 'react';
import { Link } from "react-router-dom";
import './hostGame.css'
import startGameApi from '../../apis/startGame';
import addPlayerApi from '../../apis/addPlayer';

export default function HostGame() {
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState({team: '', role: ''});
  
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [gameId, setGameId] = useState(null);
  const [turn, setTurn] = useState(null);

  const [hostId, setHostId] = useState(null);


  function handleJoin(team, role) {
    if (gameId) {
      return;
    }
    setSelected({ team, role });
  }

  function copyToClip( text ) {
    navigator.clipboard.writeText(text);
    setCopied(true)
    setTimeout(() => setCopied(false), 3000);
  }
  
async function startGameHandler() {
  if (!username.trim() || !selected.team) {
    setError(true);
    setTimeout(() => setError(false), 3000);
    return;
  }

  setLoading(true);

  try {
    const startData = await startGameApi();

    setGameId(startData.gameId);
    setTurn(startData.turn);

    const playerId = await addPlayerApi({
      name: username,
      role: selected.role,
      host: true,
      team: selected.team,
      gameId: startData.gameId
    });

    setHostId(playerId);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  
  return (
    <div className={`root-container ${loading || !!gameId ? "locked" : ""}`}>

      <div className='team-column'>
        <h2 className='team-title red-title'>Red Team</h2>
        <div className='team-card red-card'>
          <span>Spymaster</span>
          <button className= {`join-btn ${selected.role === 'spymaster_red' ? "joined" : "red-btn"}`} 
            onClick={() => handleJoin('red', 'spymaster_red')}
          >
            {selected.role === 'spymaster_red' ? 'Joined' : 'Join'}
          </button>
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

      <div className="host-game">  
        <h1>Host new game</h1>
        <div className="host-card">
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
        </div>
        
        {!gameId && !loading && (
          <div className='btn-padding'>
            <button className="button" onClick={() => startGameHandler()}>
              <div>
                <span>Start Game</span>
              </div>
            </button>
          </div>
        )}
        
        {loading && <div className="loader"></div>}
        
        {gameId && !loading &&(
          <div className='game-actions'>
            <div className='copy-section'>
              <div className='copy-text'>{copied ? "✅ Copied": "Click to copy game id"}</div>
              <button className='game-id-button' onClick={() => copyToClip(gameId)}>
                <div className='game-id-text'>{gameId}</div>
              </button>
            </div>
            <Link to={`/game/${gameId}`} className="play-button">
              Play Game
            </Link>
          </div>
        )}



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