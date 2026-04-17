import { useState } from 'react';
import './hostGame.css'
import './joinCards.css'
import startGame from '../../apis/startGame' 

export default function HostGame() {
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState({team: '', role: ''});
  
  const [error, setError] = useState(false);
  const [apiError, setApiError] = useState(false)
  const [loading, setLoading] = useState(false);
  
  const [gameId, setGameId] = useState(null);
  const [turn, setTurn] = useState(null);

  function handleJoin(team, role) {
    if (gameId) {
      return;
    }
    setSelected({ team, role });
  }
  
  function handleShowId(id) {
    if (id){
      
    }
    return null;
  }
  
  async function showGame() {
    if (!username.trim() || !selected.team) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const data = await startGame();
      setGameId(data.gameId);
      setTurn(data.turn);
      console.log(data.gameId)
      
      
    } catch (err) {
      setApiError(true);
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
          <button className="button" onClick={() => showGame()}>
            <div>
              <span>Start Game</span>
            </div>
          </button>
        </div>
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