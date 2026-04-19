import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import getPlayersApi from "../../apis/getPlayers";
import addPlayerApi from "../../apis/addPlayer";
import gameExistsApi from "../../apis/gameExists";
import './joinGame.css'

export default function JoinGame() {
  const { gameId } = useParams(); 
  const navigate = useNavigate();
  const [gameExists, setGameExists] = useState(null);
  const [joined, setJoined] = useState({
    "spymaster_red": false,
    "spymaster_blue": false,
    "operative_red": false,
    "operative_blue": false
  });
  const [checkingGame, setCheckingGame] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [players, setPlayers] = useState([]);

  async function getPlayers() {
    setLoadingPlayers(true);
    try {
      const players = await getPlayersApi(gameId)
      setPlayers(players);
      }
      catch (err) {
        console.error(err);
      } finally {
        setLoadingPlayers(false);
    }
  }

  async function handleAddPlayer({newName, newRole, newHost, newTeam, newGameId}) {
    setAddingPlayer(true);
    try {
      const newPlayerData = await addPlayerApi({
        name: newName,
        role: newRole,
        host: newHost,
        team: newTeam,
        gameId: newGameId
      })
      }
      catch (err) {
        console.error(err);
      } finally {
        setAddingPlayer(false);
    }
  }

  async function checkGameExists() {
    setCheckingGame(true);
    try {
      const exists = await gameExistsApi(gameId)
      setGameExists(exists)
      }
      catch (err) {
        console.error(err);
      } finally {
        setCheckingGame(false);
    }
  }

  async function handleJoin() {

  }

  useEffect(() => {
    checkGameExists();
  }, [gameId]);

  if (checkingGame) {
    return (
    <div className="game-exists-container">
      <div className="loader"></div>
      <p>Joining game</p>
    </div>
    );
  }

  if (gameExists === false) {
    return (
      <div className="game-exists-container">
        <h1>The game you are looking for does not exist</h1>
        <button className="button" onClick={() => navigate("/")}>
          <div><span>Go home</span></div>
        </button>
      </div>
    );
  }

  return (
    <div className={`root-container ${loadingPlayers || checkingGame || addingPlayer ? "locked" : ""}`}>
      <div>
        hiii
      </div>
    </div>

  );
}