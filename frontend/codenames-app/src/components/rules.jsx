import { useState } from 'react';
import './rules.css'

export default function Rules() {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <button className="rules-btn" onClick={() => setShowRules(true)}>
        Rules
      </button>

      {showRules && (
        <div className="rules-overlay" onClick={() => setShowRules(false)}>
          <div className="rules-popup" onClick={e => e.stopPropagation()}>
            <h2>Rules</h2>
            <p>The goal of the game is simple: start a new round and try to achieve the highest score possible by making the correct choices at each step.
              As the game progresses, the difficulty increases, requiring quicker thinking and better decisions.
              Each correct action earns you points, while mistakes may cost you progress or end the round.
              Stay focused, learn from each attempt, and aim to improve your performance every time you play.
            </p>
            <button onClick={() => setShowRules(false)}>X</button>
          </div>
        </div>
      )}
    </>
  );
}