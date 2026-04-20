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

  const [nameError, setNameError] = useState(false);

  const [gameExists, setGameExists] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const [joined, setJoined] = useState({
    "spymaster_red": false,
    "spymaster_blue": false,
    "operative_red": false,
    "operative_blue": false
  });

  const [checkingGame, setCheckingGame] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);

  const [currPlayerName, setCurrPlayerName] = useState('');
  const [currPlayerId, setCurrPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(1);
  const redOperative = players.filter(
    (p) => p.role === "operative_red"
  );
  const blueOperative = players.filter(
    (p) => p.role === "operative_blue"
  );
  const redSpymaster = players.filter(
    (p) => p.role === "spymaster_red"
  );
  const blueSpymaster = players.filter(
    (p) => p.role === "spymaster_blue"
  );
  const host = players.find(p => p.host === true);
  const hostId = players.find(p => p.host)?.id;

  async function getPlayers() {
    setLoadingPlayers(true);
    try {
      const players = await getPlayersApi(gameId)
      setPlayers(players);
      setNumPlayers(players.length);
      }
      catch (err) {
        console.error(err);
      } finally {
        setLoadingPlayers(false);
    }
  }

  async function handleAddPlayer({ newName, newRole, newHost, newTeam, newGameId }) {
    setAddingPlayer(true);
    try {
      const newPlayerId = await addPlayerApi({
        name: newName,
        role: newRole,
        host: newHost,
        team: newTeam,
        gameId: newGameId
      })
      setCurrPlayerId(newPlayerId);
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

  async function handleJoin({newName, newRole, newHost, newTeam, newGameId}) {
    if (currPlayerName === '') {
      setNameError(true);
      setTimeout(() => setNameError(false), 3000);
      return;
    }
    await handleAddPlayer({ 
      playerName:newName,
      role:newRole,
      host:newHost, 
      team:newTeam, 
      gameId:newGameId 
    })
    useEffect(() => {
      if (!gameId) return;
      getPlayers();
    }, [gameId]);
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

      <div className='team-column'>
        <h2 className='team-title red-title'>Red Team</h2>
        <div className='team-card red-card'>
          <div className="team-card-name-text">
            <span>{currPlayerName || "Empty"}</span>
          </div>
          <button className= {`join-btn ${redSpymaster === 'spymaster_red' ? "joined" : "red-btn"}`} 
            onClick={() => handleJoin('red', 'spymaster_red')}
          >
            {redSpymaster === 'spymaster_red' ? 'Joined' : 'Join'}
          </button>
          <div className="team-card-role-text">
            <span>Spymaster</span>
          </div>
        </div>
        <div className='team-card red-card'>
          <div className="team-card-name-text">
            <span>{currPlayerName || "Empty"}</span>
          </div>
          <button className= {`join-btn ${redOperative === 'operative_red' ? "joined" : "red-btn"}`} 
            onClick={() => handleJoin('red', 'operative_red')}
          >
            {redOperative === 'operative_red' ? 'Joined' : 'Join'}
          </button>
          <div className="team-card-role-text">
            <span>Operative</span>
          </div>
        </div>
      </div>

      <div className="game-actions">  
        <h1>Join Game</h1>
        <div className="input-card">
          <div className="input-container">
            <input
              type="text"
              value={currPlayerName}
              onChange={(e) => setCurrPlayerName(e.target.value)}
              required
              />
            <label className="label">Username</label>
            <div className="underline"></div>
          </div>
        </div>
        <div>
          <button className="button">
            <div><span>Join Game</span></div>
          </button>
        </div>
        {!gameStarted && currPlayerId !== hostId && (
          <p>Waiting for host to start game...</p>
        )}
        {!gameStarted && currPlayerId === hostId && (
          <p>Start Game button</p> // TODO add this in a bit
        )}
      </div>

      <div className='team-column'>
        <h2 className='team-title blue-title'>Blue Team</h2>
        <div className='team-card blue-card'>
          <div className="team-card-name-text">
            <span>{currPlayerName || "Empty"}</span>
          </div>
          <button className= {`join-btn ${blueSpymaster === 'spymaster_blue' ? "joined" : "blue-btn"}`} 
            onClick={() => handleJoin('red', 'spymaster_red')}
          >
            {blueSpymaster === 'spymaster_blue' ? 'Joined' : 'Join'}
          </button>
          <div className="team-card-role-text">
            <span>Spymaster</span>
          </div>
        </div>
        <div className='team-card blue-card'>
          <div className="team-card-name-text">
            <span>{currPlayerName || "Empty"}</span>
          </div>
          <button className= {`join-btn ${blueOperative === 'operative_blue' ? "joined" : "blue-btn"}`} 
            onClick={() => handleJoin('red', 'operative_red')}
          >
            {blueOperative === 'operative_blue' ? 'Joined' : 'Join'}
          </button>
          <div className="team-card-role-text">
            <span>Operative</span>
          </div>
        </div>
      </div>

    </div>
  );
}