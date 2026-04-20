import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './homeButtons.css'

export default function HomeButtons() {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="container">
      {!showOptions && (
        <button className="button" onClick={() => setShowOptions(true)}>
          <div><span>Play</span></div>
        </button>
      )}

      {showOptions && (
        <div className="home-buttons">
          <button className="button" onClick={() => navigate("/setup-game")}>
            <div><span>Start Game</span></div>
          </button>
          <button className="button" onClick={() => navigate("/join-game")}>
            <div><span>Join Game</span></div>
          </button>
        </div>

      )}
    </div>
  );
}