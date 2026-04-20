import { useState } from "react";
import startGameApi from '../../apis/startGame';
import "./setupGame.css"


export default function setupGame() {

  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [turn, setTurn] = useState(null);
  
  async function startGameHandler() {
    setLoading(true);
    try {
      const startData = await startGameApi();
      setGameId(startData.gameId);
      setTurn(startData.turn);
      navigate(`/start-game/${startData.gameId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

    </div>
  );
}