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
  const [demoModeTry, setDemoModeTry] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoPwd, setDemoPwd] = useState('');

  function handleDemoModeCheck() {
    if (demoPwd === 'pwd') {
      setDemoMode(true);
    }
    setDemoModeTry(false);
  }

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

    if (hostName === "demomode") {
      setDemoModeTry(true);
    }

    setLoading(true);
    try {
      const startData = await startGameApi();
      setGameId(startData.gameId);
      setTurn(startData.turn);
      localStorage.setItem(`currentTurn_${startData.gameId}`, startData.turn);

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

              <button className={`setup-game-id-button ${copied ? 'copied' : ''}`}onClick={() => copyToClip(`https://arthsalgia-codenames.vercel.app/play-game/${gameId}`)}>
                <div className='setup-game-id-text'>{gameId}</div>
              </button>
            </div>
            {ready && (
              <Link to={`/start-game/${gameId}`} className="setup-play-button" onClick={() => localStorage.setItem(`demoMode_${gameId}`, demoMode)}>
                Go To Lobby
              </Link>
            )}

          </div>
        )}

        {demoModeTry && (
          <div className="demo-container">

            <div className="demo-pwd-container">
              <div className="setup-card">
                <div className="input-container">
                  <input
                    type="text"
                    value={demoPwd}
                    onChange={(e) => setDemoPwd(e.target.value)}
                    required
                    />
                  <label className="label">Password</label>
                  <div className="underline"></div>
                </div>
              </div>
              <button className="button" onClick={() => setDemoModeTry(false)}>
                <div><span>Cancel</span></div>
              </button>
              <button className="button" onClick={() => handleDemoModeCheck()}>
                <div><span>Enter</span></div>
              </button>
            </div>

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