import { useState } from 'react';
import '../header.css'
import AboutText from './aboutText';

export default function About() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <button className="header-btn" onClick={() => setShowAbout(true)}>
        About
      </button>

      {showAbout && (
        <div className="header-overlay" onClick={() => setShowAbout(false)}>
          <div className="header-popup" onClick={e => e.stopPropagation()}>
            <AboutText/>

            <button onClick={() => setShowAbout(false)}>X</button>
          </div>
        </div>
      )}
    </>
  );
}