import { useState } from "react";
import startGameApi from '../../apis/startGame';
import addPlayerApi from '../../apis/addPlayer';
import "./setupGame.css"


export default function setupGame() {

  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [turn, setTurn] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [hostName, setHostName] = useState('');
  const [error, setError] = useState(false);
  
  async function startGameHandler() {
    if (!hostName) {
      setError(true);
      setTimeout(() => {setError(false)}, 3000);
      return;
    }

    setLoading(true);
    try {
      const startData = await startGameApi();
      setGameId(startData.gameId);
      setTurn(startData.turn);

      const addPlayerData = await addPlayerApi({
        name: hostName,
        role: null,
        host: true,
        team: null,
        gameId: gameId
      });

      setHostId(addPlayerData.id);

      localStorage.setItem("hostId", hostId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="root-container">
      <div className="start-game">  
        <h1>Start new game</h1>
        <div className="start-card">
          <div className="input-container">
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              required
              />
            <label className="label">Username</label>
            <div className="underline"></div>
          </div>
        </div>
        {!gameId && !loading && (
          <button className="button" onClick={() => startGameHandler()}>
            <div><span>Create Game</span></div>
          </button>
        )}
        
        {loading && <div className="loader"></div>}
        
        {gameId && !loading &&(
          <div className='game-actions'>
            <div className='copy-section'>
              <div className={'copy-label'}>
                {copied ? "✅ Copied!" : "Click to copy game id"}
              </div>

              <button className={`game-id-button ${copied ? 'copied' : ''}`}onClick={() => copyToClip(gameId)}>
                <div className='game-id-text'>{gameId}</div>
              </button>
            </div>
            <Link to={`/join-game/${gameId}`} className="play-button">
              Play Game
            </Link>
          </div>
        )}

        {error && (
          <div className="error">
            <span className="error-message">* Username required</span>
          </div>
        )}
        </div>

    </div>
  );
}