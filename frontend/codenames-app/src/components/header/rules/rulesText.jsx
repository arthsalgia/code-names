import './rulesText.css';

export default function RulesText() {
  return (
    <div className="rules-text">
      <div className="rules-text-header">
        <div className="title">Codenames: Rules</div>
        <div className="subtitle">A simple guide to how to play the game of Codenames.</div>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Objective</div>
        <div>Two teams compete to identify all of their assigned words based on one-word
          clues given by their team's Spymaster. The team that finds all their words
          first wins the game.</div>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Setup</div>
        <ul>
          <li>Divide players into two teams (Red and Blue).</li>
          <li>Each team selects one Spymaster.</li>
          <li>Lay out 25 word cards in a 5x5 grid.</li>
          <li>The Spymasters receive a key card showing which words belong to which team.</li>
        </ul>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Card Types</div>
        <ul>
          <li><strong>Red Agents:</strong> Words the Red team must guess.</li>
          <li><strong>Blue Agents:</strong> Words the Blue team must guess.</li>
          <li><strong>Bystanders:</strong> Neutral words that end the turn.</li>
          <li><strong>Assassin:</strong> Guessing this word immediately loses the game.</li>
        </ul>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Gameplay</div>
        <ol>
          <li>The starting team is determined by the key card.</li>
          <li>The Spymaster gives a one-word clue followed by a number (e.g., "Animal 2").</li>
          <li>The number indicates how many words relate to the clue.</li>
          <li>The team discusses and makes guesses one at a time.</li>
          <li>The turn continues until:
            <ul>
              <li>They guess incorrectly</li>
              <li>They choose to stop</li>
              <li>They exceed the number of guesses.</li>
            </ul>
          </li>
          <li>Then the opposing team takes their turn.</li>
        </ol>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Giving Clues</div>
        <ul>
          <li>Clues must be a single word.</li>
          <li>No gestures, spelling, or additional hints.</li>
          <li>Clues must relate to meaning, not position or appearance.</li>
        </ul>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Winning the Game</div>
        <ul>
          <li>A team wins by guessing all their words correctly.</li>
          <li>A team instantly loses if they guess the Assassin.</li>
        </ul>
      </div>

      <div className="rules-section">
        <div className="rules-section-title">Optional Rules</div>
        <ul>
          <li><strong>Timer:</strong> Limit discussion time.</li>
          <li><strong>Zero Clues:</strong> A clue with "0" means none of your team's words relate.</li>
        </ul>
      </div>

      <div className='rules-text-sneaky'> 
        <div>
          All these rules are made by chatGPT so they might be wrong
        </div>
        <div>
          If you actually want to know how to play go to codenames.com
        </div>
      </div>

    </div>
  );
}