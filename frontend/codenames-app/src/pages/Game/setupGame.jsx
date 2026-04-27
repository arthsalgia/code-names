import { useState } from "react";
import startGameApi from '../../apis/startGame';
import addPlayerApi from '../../apis/addPlayer';
import { Link } from "react-router-dom";
import "./setupGame.css"


export default function setupGame() {

  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [turn, setTurn] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [hostName, setHostName] = useState('');
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  function copyToClip( ID ) {
    navigator.clipboard.writeText(ID);
    setCopied(true)
    setTimeout(() => setCopied(false), 2000);
  }
  
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

      const addPlayerId = await addPlayerApi({
        name: hostName,
        role: null,
        host: true,
        team: null,
        gameId: startData.gameId
      });

      setHostId(addPlayerId);
      localStorage.setItem(`playerId_${startData.gameId}`, addPlayerId);
      setReady(true);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="setup-root-container">
      <div className="setup-inner">  
        <h1>Start new game</h1>
        {!gameId && (
          <div className="setup-card">
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
        )}
        {!gameId && !loading && (
          <button className="button" onClick={() => startGameHandler()}>
            <div><span>Create Game</span></div>
          </button>
        )}
        
        {loading && <div className="loader"></div>}
        
        {gameId && !loading &&(
          <div className='setup-game-actions'>
            <div className='setup-copy-section'>
              <div className={'setup-copy-label'}>
                {copied ? "✅ Copied!" : "Click to copy game id"}
              </div>

              <button className={`setup-game-id-button ${copied ? 'copied' : ''}`}onClick={() => copyToClip(gameId)}>
                <div className='setup-game-id-text'>{gameId}</div>
              </button>
            </div>
            {ready && (
              <Link to={`/start-game/${gameId}`} className="setup-play-button">
                Join Game
              </Link>
            )}
            
          </div>
        )}

        {error && (
          <div className="setup-error">
            <span className="setup-error-message">* Username required</span>
          </div>
        )}
        </div>

    </div>
  );
}