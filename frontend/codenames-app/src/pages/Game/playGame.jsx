import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import Board from '../../components/board.jsx'
import getCardsApi from '../../apis/getCards.jsx';
import getPlayerApi from '../../apis/getPlayer.jsx';
import sendHintApi from '../../apis/sendHint.jsx';
import makeGuessApi from '../../apis/makeGuess.jsx'
import changeTurnApi from '../../apis/changeTurn.jsx'

import sharkRed from '../../assets/hintSharkRed.png'
import sharkBlue from '../../assets/hintSharkBlue.png'

import './playGame.css'

export default function PlayGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [demoMode, setDemoMode] = useState(() => localStorage.getItem(`demoMode_${gameId}`) === "true");
  const [demoSelected, setDemoSelected] = useState({show : false, team: '', role: ''});

  const wsRef = useRef(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(false);
  const [hintError, setHintError] = useState(false);
  const [hintNumError, setHintNumError] = useState(false);
  
  const [getCardsLoading, setGetCardsLoading] = useState(false);
  const [sendHintLoading, setSendHintLoading] = useState(false);
  const [sendGuessLoading, setSendGuessLoading] = useState(false);
  const [changeTurnLoading, setChangeTurnLoading] = useState(false);
  
  const [gameStarted, setGameStarted] = useState(() => localStorage.getItem(`gameStarted_${gameId}`) === "true");
  const [gameOver, setGameOver] = useState(() => localStorage.getItem(`gameOver_${gameId}`) === "true");
  const [winner, setWinner] = useState('');
  const [isHost, setIsHost] = useState(() => localStorage.getItem(`isHost_${gameId}`) === "true");
  const [playerId, setPlayerId] = useState(() => localStorage.getItem(`playerId_${gameId}`));

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem(`players_${gameId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [turn, setTurn] = useState("");
  const [currRole, setCurrRole] = useState("")

  const [remainingCards, setRemainingCards] = useState({'red' : '', 'blue' : ''})
  
  const [team, setTeam] = useState(() => localStorage.getItem(`team_${gameId}`));
  const [role, setRole] = useState(() => localStorage.getItem(`role_${gameId}`));
  const [isSpymaster, setIsSpymaster] = useState(false);
  const [isOperative, setIsOperative] = useState(false);

  const endTurnRef = useRef(false);
  const [displayChangeTurn, setDisplayChangeTurn] = useState(false)

  const [hint, setHint] = useState('');
  const [numGuesses, setNumGuesses] = useState('');

  const [recivedHint, setRecivedHint] = useState({hint : '', NOG : '', team : ''});
  const [displayHint, setDisplayHint] = useState(false);

  function demoHandleJoin(team, role) {    
    setDemoSelected({ team, role });
    setRole(role);
    setTeam(team);

    if (role.includes('spy')) {
      setIsSpymaster(true);
      setIsOperative(false);
    }
    else {
      setIsOperative(true);
      setIsSpymaster(false);
    }
  } 

  async function demoChangeTurn() {
    if (endTurnRef.current) return;
    endTurnRef.current = true;
    try {
      setChangeTurnLoading(true);
      await changeTurnApi(gameId)
    } catch (err) {
        console.error(err);
    } finally {
        setChangeTurnLoading(false);
        endTurnRef.current = false;
    }
  }

  function demoChangeRole() {
    if (currRole.includes('spy')) {
      setCurrRole('operative');
    }
    else {
      setCurrRole('spymaster');
    }
  }

  function checkRole() {
    if (role === "spymaster_red" || role === "spymaster_blue") {
      setIsSpymaster(true);
    }
    if (role === "operative_red" || role === "operative_blue") {
      setIsOperative(true);
    }
  }

  function showHint() {
    setDisplayHint(true);
    setTimeout(() => setDisplayHint(false), 3000);
  }

  function formatText(text) {
    if (!text) {return}
    if ((text) => text.trim() !== "" && !isNaN(Number(text))) {return text}
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

  function findPlayerTeam(role, team) {
    if (!role || !team) return;
    for (let i = 0; i < players.length; i++) {
      if (players[i].role.includes(role) && players[i].team === team) {
        return players[i].name;
      }
    }
  }

  function checkPlayer(role, team) {
    if (!role || !team || players.length < 4) return false;
    for (let i = 0; i < players.length; i++) {
      if (players[i].role.includes(role) && players[i].team === team) {
        return true;
      }
    }
    return false;
  }

  function isMyTurn() {
    if (turn === team && role.includes(currRole)) {
      return true;
    }
    return false;
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
      setHint('');
      setNumGuesses('');
    } catch (err) {
        console.error(err);
    } finally {
        setSendHintLoading(false);
    }
  }

  async function handleGuess(word) {
    try {
      setSendGuessLoading(true);
      await makeGuessApi(gameId, word, role, team)
    } catch (err) {
        console.error(err);
    } finally {
        setSendGuessLoading(false);
    }
  }

  async function endTurn() {
    if (endTurnRef.current) return;
    endTurnRef.current = true;
    try {
      setChangeTurnLoading(true);
      await changeTurnApi(gameId)
    } catch (err) {
        console.error(err);
    } finally {
        setChangeTurnLoading(false);
        endTurnRef.current = false;
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
        const redCount = formattedCards.filter(
          card => card.card_type === "red"
        ).length;

        const blueCount = formattedCards.filter(
          card => card.card_type === "blue"
        ).length;
        setRemainingCards({red : redCount, blue : blueCount})
        const savedTurn = localStorage.getItem(`currentTurn_${gameId}`);
        const savedCurrRole = localStorage.getItem(`currRole_${gameId}`);
        setCards(formattedCards);
        setTurn(savedTurn);
        setCurrRole(savedCurrRole);
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
    if (wsRef.current) return;

    const ws = new WebSocket(`wss://arthsalgia-codenames.onrender.com/ws/${gameId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "GUESS":
          setCards(prev => {
            const updated = prev.map(card =>
              card.word === data.payload.word
                ? { ...card, guessed: data.payload.guessed }
                : card
            );

            const redCount = updated.filter(
              c => c.card_type === "red" && !c.guessed
            ).length;

            const blueCount = updated.filter(
              c => c.card_type === "blue" && !c.guessed
            ).length;
            
            setRemainingCards({ red : redCount, blue : blueCount })
            
            return updated;
          });
          if (data.payload.winner === 'red' || data.payload.winner === 'blue') {
            setWinner(data.payload.winner);
            console.log("winner: ", data.payload.winner)
            setGameOver(true);
            localStorage.setItem(`gameOver_${gameId}`, 'true');
          }
          break 

        case "HINT":
          const hintData = data.payload.hint
          const numGuesses = data.payload.NOG
          const teamData = data.payload.team
          setRecivedHint({hint : hintData, NOG : numGuesses, team : teamData})
          localStorage.setItem(`currRole_${gameId}`, 'operative')
          setCurrRole('operative');
          showHint();
          break

        case "CHANGE_TURN":
          const next_turn = data.payload.turn
          setCurrRole('spymaster');
          setDisplayChangeTurn(true);
          setTimeout(() => {setDisplayChangeTurn(false)}, 2000);
          localStorage.setItem(`currRole_${gameId}`, 'spymaster')
          setTurn(data.payload.turn);
      }

    }
    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    ws.onclose = () => {
      console.log("WS closed, reconnecting...");
      wsRef.current = null;
      setTimeout(() => {
        if (gameStarted) {
          setReconnectCount(c => c + 1);
        }
      }, 2000);
    };
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
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
            <div className="top-bar-left">
              {demoMode && (
                <button className={`demo-button ${(turn === 'red') ? "red" : "blue"}`} onClick={() => demoChangeTurn()}>
                  Change Turn
                </button>
              )}
            </div>
            <div className="game-info">
              <h1 className={`turn ${turn}`}>
                {isMyTurn() && (
                  <div>Turn: Your Turn</div>
                )}
                {!isMyTurn() && (
                  <div>Turn: {formatText(checkPlayer(currRole, turn) ? findPlayerTeam(currRole, turn) : `${formatText(turn)} ${formatText(currRole)}` )}</div>
                )}
              </h1>
            </div>
            <div className="top-bar-right">
              {demoMode && (
                <button className={`demo-button ${(turn === 'red') ? "red" : "blue"}`} onClick={() => demoChangeRole()}>
                  Change Role
                </button>
              )}
            </div>
          </div>
          <div className="game-layout-wrapper">
            <div className="game-layout">
    
              <div className="team-column red">
                <div className="team-column-title red">
                  Cards left: {remainingCards.red}
                </div>
                <div className={`team-card red ${(role === 'spymaster_red' && team === 'red') ? "current-player" : ""}`}>
                  <div className="team-role-text red">Spy Master</div>
                    {demoMode && (
                      <button className= {`join-btn ${demoSelected.role === 'spymaster_red' ? "joined" : "red-btn"}`} 
                        onClick={() => demoHandleJoin('red', 'spymaster_red')}
                      >
                        {demoSelected.role === 'spymaster_red' ? 'Joined' : 'Join'}
                      </button>
                    )}
                    {!demoMode && (  
                      <div className="name-text">{findPlayer('spymaster_red')}</div>
                    )}
                </div>

                <div className={`team-card red ${(role === 'operative_red' && team === 'red') ? "current-player" : ""}`}>
                  <div className="team-role-text red">Operative</div>
                  {demoMode && (
                    <button className= {`join-btn ${demoSelected.role === 'operative_red' ? "joined" : "red-btn"}`} 
                      onClick={() => demoHandleJoin('red', 'operative_red')}
                    >
                      {demoSelected.role === 'operative_red' ? 'Joined' : 'Join'}
                    </button>
                  )}
                  {!demoMode && (  
                    <div className="name-text">{findPlayer('operative_red')}</div>
                  )}
                </div>
              </div>

              <div className='board-column'>
                <div className={`board-area ${
                    isSpymaster ||
                    (isOperative && (team !== turn || !role.includes(currRole)))
                      ? "locked"
                      : ""
                  }`}
                >

                  <Board wordlist={cards} isSpy={isSpymaster} handleGuess={handleGuess}/>
                </div>

                {isSpymaster && (
                  <div className={`hint ${(turn !== team || !role.includes(currRole)) ? "locked" : ""}`}>
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

                {isOperative && turn === team && role.includes(currRole) && (
                  <div className={`${(turn !== team || !role.includes(currRole)) ? "end-turn-locked" : ""}`}>
                    <button className='button'onClick={() => endTurn()} disabled={changeTurnLoading}>
                      <div><span>End Turn</span></div>
                    </button>
                  </div>
                )}

              </div>

              <div className="team-column blue">
                <div className="team-column-title blue">
                  Cards left: {remainingCards.blue}
                </div>
                <div className={`team-card blue ${(role === 'spymaster_blue' && team === 'blue') ? "current-player" : ""}`}>
                  <div className="team-role-text blue">Spy Master</div>
                  {demoMode && (
                    <button className= {`join-btn ${demoSelected.role === 'spymaster_blue' ? "joined" : "blue-btn"}`} 
                      onClick={() => demoHandleJoin('blue', 'spymaster_blue')}
                    >
                      {demoSelected.role === 'spymaster_blue' ? 'Joined' : 'Join'}
                    </button>
                  )}
                  {!demoMode && (  
                    <div className="name-text">{findPlayer('spymaster_blue')}</div>
                  )}
                </div>
                <div className={`team-card blue ${(role === 'operative_blue' && team === 'blue') ? "current-player" : ""}`}>
                  <div className="team-role-text blue">Operative</div>
                  {demoMode && (
                    <button className= {`join-btn ${demoSelected.role === 'operative_blue' ? "joined" : "blue-btn"}`} 
                      onClick={() => demoHandleJoin('blue', 'operative_blue')}
                    >
                      {demoSelected.role === 'operative_blue' ? 'Joined' : 'Join'}
                    </button>
                  )}
                  {!demoMode && (  
                    <div className="name-text">{findPlayer('operative_blue')}</div>
                  )}
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
      {sendGuessLoading && (<div className='loading-container guess'><div className="loader"></div></div>)}
      {changeTurnLoading && (<div className='loading-container guess'><div className="loader"></div></div>)}

      {gameOver && (
        <div className='game-over'>
            <h1>GAME OVER</h1>
            <h1 className={`${winner}`}>{formatText(winner)} wins</h1>
            <div className='game-over-button'>
              <button className="button" onClick={() => navigate("/")}>
                <div><span>Play Again</span></div>
              </button>
            </div>
        </div>
      )}

      {displayHint && (
        <div className='display'>
          <div className='display-img'>
            <img src={recivedHint.team === 'red' ? sharkRed : sharkBlue} />
          </div>

          <div className={`display-card ${recivedHint.team === 'red' ? 'red' : 'blue'}`}>
            <div className='display-text'>{recivedHint.hint}</div>
            <div className='display-number'>{recivedHint.NOG}</div>
          </div>
        </div>
        )}

      {displayChangeTurn && (
        <div className='display'>
          <div className={`display-turn-card ${turn === 'red' ? 'red' : 'blue'}`}>
            <div className='display-text-head'>Turn:</div>
              {isMyTurn() && (
                <div className='display-text'>Your Turn</div>
              )}
              {!isMyTurn() && (
                <div className='display-text'>{formatText(checkPlayer(currRole, turn) ? findPlayerTeam(currRole, turn) : `${turn} ${currRole}` )}</div>
              )}
            <div className='display-text-s'>{`${formatText(turn)} ${formatText(currRole)}`}</div>
          </div>
        </div>
      )}

    </div>
  );
}