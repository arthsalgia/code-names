import { useState } from 'react';
import '../header.css'
import RulesText from './rulesText';

export default function Rules() {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <button className="header-btn" onClick={() => setShowRules(true)}>
        Rules
      </button>

      {showRules && (
        <div className="header-overlay" onClick={() => setShowRules(false)}>
          <div className="header-popup" onClick={e => e.stopPropagation()}>
            <RulesText/>

            <button onClick={() => setShowRules(false)}>×</button>
          </div>
        </div>
      )}
    </>
  );
}