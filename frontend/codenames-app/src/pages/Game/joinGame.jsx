import gameExistsApi from "../../apis/gameExists";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function GoToGame() {
  const [error, setError] = useState(false);
  const [checkingGame, setCheckingGame] = useState(false);
  const [gameId, setGameId] = useState('');
  const [gameExists, setGameExists] = useState(false);
  const navigate = useNavigate();

  async function handleClick() {
  if (!gameId) return;

  setCheckingGame(true);

  try {
    const exists = await gameExistsApi(gameId);
    if (exists) {
      setGameExists(true);
      navigate(`/start-game/${gameId}`)
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingGame(false);
  }
}

  return (
    <div className={`root-container ${checkingGame ? "locked" : ""}`}>

      <div className="game-actions">  
        <h1>Join Game</h1>
        {!gameExists && (
          <div className="start-card">
            <div className="input-container">
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                disabled={checkingGame}
                required
                />
              <label className="label">Enter Game ID</label>
              <div className="underline"></div>
            </div>
          </div>
        )}
        {!gameExists &&  !checkingGame && (
          <div>
            <button className="button" onClick={() => handleClick()}>
              <div><span>Join Game</span></div>
            </button>
          </div>
        )}

        {checkingGame && (<div className="loader"></div>)}
      </div>

      {error && (
        <div className="error">
          <span className="error-message">* Game doesn't exist :(</span>
        </div>
      )}

    </div>
  );
}
