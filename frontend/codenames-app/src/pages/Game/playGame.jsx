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
  const [players, setPlayers] = useState(() => localStorage.getItem(`players_${gameId}`));
  const [gameStarted, setGameStarted] = useState(() => localStorage.getItem(`gameStarted_${gameId}`) === "true");

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
        console.log(data)
      }
      catch (err){
        console.log(err);
      }
      finally {
        setGetCardsLoading(false);
      }
    }
    getCards()
  }, [gameId]);

  return (
    <div>
      {!gameStarted && (
        <div className='play-game-started'>
          <h1>Game not started</h1>
          <button className="button" onClick={() => navigate("/")}>
            <div><span>Go Home</span></div>
          </button>
        </div>
      )}
      {gameStarted && (
        <div className={`play-root-container ${getCardsLoading ? "locked" : ""}`}>
            <Board wordlist={cards}></Board>

        </div>
      )}
    </div>
  );
}