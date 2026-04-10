import { useState } from 'react';
import './rules.css'
import RulesText from './rulesText';

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
            <RulesText/>

            <button onClick={() => setShowRules(false)}>X</button>
          </div>
        </div>
      )}
    </>
  );
}