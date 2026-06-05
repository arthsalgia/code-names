import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import Board from '../../components/board.jsx'
import getCardsApi from '../../apis/getCards.jsx';
import getPlayerApi from '../../apis/getPlayer.jsx';
import sendHintApi from '../../apis/sendHint.jsx';

import sharkRed from '../../assets/hintSharkRed.png'
import sharkBlue from '../../assets/hintSharkBlue.png'

import './playGame.css'

export default function PlayGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(false);
  const [hintError, setHintError] = useState(false);
  const [hintNumError, setHintNumError] = useState(false);
  
  const [getCardsLoading, setGetCardsLoading] = useState(false);
  const [sendHintLoading, setSendHintLoading] = useState(false);
  
  const [gameStarted, setGameStarted] = useState(() => localStorage.getItem(`gameStarted_${gameId}`) === "true");
  const [isHost, setIsHost] = useState(() => localStorage.getItem(`isHost_${gameId}`) === "true");
  const [playerId, setPlayerId] = useState(() => localStorage.getItem(`playerId_${gameId}`));

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem(`players_${gameId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [turn, setTurn] = useState("");
  const [currRole, setCurrRole] = useState("spymaster")

  const [team, setTeam] = useState(() => localStorage.getItem(`team_${gameId}`));
  const [role, setRole] = useState(() => localStorage.getItem(`role_${gameId}`));
  const [isSpymaster, setIsSpymaster] = useState(false);
  const [isOperative, setIsOperative] = useState(false);

  const [hint, setHint] = useState('');
  const [numGuesses, setNumGuesses] = useState('');

  const [recivedHint, setRecivedHint] = useState({hint : '', NOG : '', team : ''});
  const [displayHint, setDisplayHint] = useState(false);

  function checkRole() {
    if (role === "spymaster_red" || role === "spymaster_blue") {
      setIsSpymaster(true);
    }
    if (role === "operative_red" || role === "operative_blue") {
      setIsOperative(true);
    }
  }

  function showHint() {
    if (displayHint) return

    setDisplayHint(true);
    setTimeout(() => setDisplayHint(false), 3000);
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

  async function handleSendHint() {
    if (!hint.trim() || !numGuesses.trim()) {
      setHintError(true);
      setTimeout(() => setHintError(false), 3000);
      return
    }
    if (isNaN(Number(numGuesses.trim())) || Number(numGuesses.trim()) > 10 || Number(numGuesses.trim()) < 0) {
      setHintNumError(true);
      setTimeout(() => setHintNumError(false), 3000);
      return
    }

    try {
      setSendHintLoading(true);
      await sendHintApi(gameId, hint.trim(), numGuesses.trim(), team);
    } catch (err) {
        console.error(err);
    } finally {
        setSendHintLoading(false);
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
        const savedTurn = localStorage.getItem(`currentTurn_${gameId}`);
        setCards(formattedCards);
        setTurn(savedTurn);
      }
      catch (err){
        console.log(err);
      }
      finally {
        setGetCardsLoading(false);
      }
    }
    getCards();
    checkRole();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    const ws = new WebSocket(`wss://arthsalgia-codenames.onrender.com/ws/${gameId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "GUESS":
          setCards(cards =>
            cards.map(card =>
              card.word === data.payload.word
                ? { ...card, guessed: data.payload.guessed }
                : card
            )
          );
          setCurrRole('spymaster');
          break 

        case "HINT":
          const hintData = data.payload.hint
          const numGuesses = data.payload.NOG
          const teamData = data.payload.team
          setRecivedHint({hint : hintData, NOG : numGuesses, team : teamData})
          setCurrRole('operative');
          showHint();
          break
      }

    }
    return () => ws.close();
  }, [gameId])

  return (
    <div className={`play-root-container ${getCardsLoading || sendHintLoading ? "locked" : ""}`}>
      
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
                  <div className="team-role-text red">Spy Master</div>
                  <div className="name-text">{findPlayer('spymaster_red')}</div>
                </div>

                <div className={`team-card red ${(role === 'operative_red' && team === 'red') ? "current-player" : ""}`}>
                  <div className="team-role-text red">Operative</div>
                  <div className="name-text">{findPlayer('operative_red')}</div>
                </div>
              </div>

              <div className={`board-column ${isSpymaster ? "locked" : ''}`}>
                <div className="board-area">
                  <Board wordlist={cards} isSpy={isSpymaster} />
                </div>

                {isSpymaster && (
                  <div className={`hint ${(turn !== team || role !== currRole) ? "locked" : ""}`}>
                    <div className="hint-search">
                      <input
                        type="text"
                        className="input-field search__input"
                        placeholder="Type a hint..."
                        value={hint}
                        onChange={(e) => setHint(e.target.value)}
                        required
                      />
                    </div>
                    <input
                      type="text"
                      className="input-field num__input"
                      placeholder="-"
                      value={numGuesses}
                      onChange={(e) => setNumGuesses(e.target.value)}
                      required
                    />
                    <div className="send-hint-button">
                      <button onClick={() => handleSendHint()}>Send</button>
                    </div>
                  </div>
                )}

                {isOperative && (
                  <div>
                    
                  </div>
                )}

              </div>

              <div className="team-column blue">
                <div className={`team-card blue ${(role === 'spymaster_blue' && team === 'blue') ? "current-player" : ""}`}>
                  <div className="team-role-text blue">Spy Master</div>
                  <div className="name-text">{findPlayer('spymaster_blue')}</div>
                </div>
                <div className={`team-card blue ${(role === 'operative_blue' && team === 'blue') ? "current-player" : ""}`}>
                  <div className="team-role-text blue">Operative</div>
                  <div className="name-text">{findPlayer('operative_blue')}</div>
                </div>
              </div>
            </div>
          </div>

          {hintError && (
              <div className="error">
                <span className="error-message">* Must enter both guess and number of hints</span>
              </div>
            )}

          {hintNumError && (
              <div className="error">
                <span className="error-message">* Number of hints must be an integer between 0 and 10 inclusive</span>
              </div>
            )}
        </div>
      )}

      {getCardsLoading && (<div className='loading-container'><div className="loader"></div></div>)}
      {sendHintLoading && (<div className='loading-container hint'><div className="loader"></div></div>)}

      {displayHint && (
        <div className={`display-hint ${recivedHint.team === 'red' ? 'red' : 'blue'}`}>
          <div className='display-img'>
            <img src={recivedHint.team === 'red' ? sharkRed : sharkBlue} />
          </div>

          <div className={`display-hint-card ${recivedHint.team === 'red' ? 'red' : 'blue'}`}>
            <div className='display-hint-text'>{recivedHint.hint}</div>
            <div className='display-hint-number'>{recivedHint.NOG}</div>
          </div>
        </div>
        )}

    </div>
  );
}