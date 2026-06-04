import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import Board from '../../components/board.jsx'
import getCardsApi from '../../apis/getCards.jsx';
import getPlayerApi from '../../apis/getPlayer.jsx';

import './playGame.css'

export default function PlayGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(false);
  
  const [getCardsLoading, setGetCardsLoading] = useState(false);
  
  const [isHost, setIsHost] = useState(() => localStorage.getItem(`isHost_${gameId}`) === "true");
  const [playerId, setPlayerId] = useState(() => localStorage.getItem(`playerId_${gameId}`));

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem(`players_${gameId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [gameStarted, setGameStarted] = useState(() => localStorage.getItem(`gameStarted_${gameId}`) === "true");
  const [turn, setTurn] = useState(() => localStorage.getItem(`currentTurn_${gameId}`));
  console.log(turn)

  const [team, setTeam] = useState(() => localStorage.getItem(`team_${gameId}`));
  const [role, setRole] = useState(() => localStorage.getItem(`role_${gameId}`));
  const [isSpymaster, setIsSpymaster] = useState(false);

  const [hint, setHint] = useState('');

  function checkIsSpymaster() {
    if (role === "spymaster_red" || role === "spymaster_blue") {
      setIsSpymaster(true);
    }
  }

  function formatText(text) {
    if (!text) {return}
    let newText = ''

    for (let i = 0; i < text.length; i++) {
      const code = text[i].charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        newText += text[i]
      }
      else {
        newText += " "
      }
    }

    return newText.split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
  }

  function findPlayer(role) {
    if (!role) return;
    for (let i = 0; i < players.length; i++) {
      if (players[i].role === role) {
        return players[i].name;
      }
    }
  }
  
  useEffect(() => {
    async function getCards() {
      setGetCardsLoading(true);
      try {
        const data = await getCardsApi(gameId);
        const formattedCards = Object.entries(data).map(([word, info]) => ({
        word,
        ...info
      }));
        setCards(formattedCards);
      }
      catch (err){
        console.log(err);
      }
      finally {
        setGetCardsLoading(false);
      }
    }
    getCards()
    checkIsSpymaster()
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const ws = new WebSocket(`wss://arthsalgia-codenames.onrender.com/ws/${gameId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "GUESS":

      }

    }
    return () => ws.close();
  }, [gameId])

  return (
    <div className={`play-root-container ${getCardsLoading ? "locked" : ""}`}>
      
      {!gameStarted && (
        <div className='play-game-started'>
          <h1>Game not started</h1>
          <button className="button" onClick={() => navigate("/")}>
            <div><span>Go Home</span></div>
          </button>
        </div>
      )}


      {gameStarted && !getCardsLoading && (
        <div>
          
          <div className="top-bar">
            <div className="game-info">
              <h1 className={`turn ${formatText(turn)}`}>
                Turn: {formatText(turn)}
              </h1>

              <div className="game-info-details">
                <p>Team: {formatText(team)}</p>
                <p>Role: {formatText(role)}</p>
              </div>
            </div>
          </div>
          <div className="game-layout-wrapper">
            <div className="game-layout">
    
              <div className="team-column red">
                <div className={`team-card red ${(role === 'spymaster_red' && team === 'red') ? "current-player" : ""}`}>
                  <div className="team-role-text">Spy Master</div>
                  <div className="name-text">{findPlayer('spymaster_red')}</div>
                </div>

                <div className={`team-card red ${(role === 'operative_red' && team === 'red') ? "current-player" : ""}`}>
                  <div className="team-role-text">Operative</div>
                  <div className="name-text">{findPlayer('operative_red')}</div>
                </div>
              </div>

              <div className="board-column">
                <div className="board-area">
                  <Board wordlist={cards} isSpy={isSpymaster} />
                </div>

                {isSpymaster && (
                  <div className="hint">
                    <div className="hint-search">
                      <input
                        type="text"
                        className="input-field search__input"
                        placeholder="Type a hint..."
                      />
                    </div>
                    <input
                      type="text"
                      className="input-field num__input"
                      placeholder="0"
                    />
                    <div className="send-hint-button">
                      <button>Send</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="team-column blue">
                <div className={`team-card blue ${(role === 'spymaster_blue' && team === 'blue') ? "current-player" : ""}`}>
                  <div className="team-role-text">Spy Master</div>
                  <div className="name-text">{findPlayer('spymaster_blue')}</div>
                </div>
                <div className={`team-card blue ${(role === 'operative_blue' && team === 'blue') ? "current-player" : ""}`}>
                  <div className="team-role-text">Operative</div>
                  <div className="name-text">{findPlayer('operative_blue')}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {getCardsLoading && (<div className='loading-container'><div className="loader"></div></div>)}

    </div>
  );
}