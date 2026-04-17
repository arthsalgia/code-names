import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './startGame.css'

export default function StartGame() {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="startGame-container">
      {!showOptions && (
        <button className="button" onClick={() => setShowOptions(true)}>
          <div><span>Play</span></div>
        </button>
      )}

      {showOptions && (
        <div className="startGame-buttons">
          <button className="button" onClick={() => navigate("/host-game")}>
            <div><span>Host Game</span></div>
          </button>
          <button className="button" onClick={() => navigate("/join-game")}>
            <div><span>Join Game</span></div>
          </button>
        </div>
      )}
    </div>
  );
}