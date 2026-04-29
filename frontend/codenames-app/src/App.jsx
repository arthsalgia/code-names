import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header.jsx'
import Home from './pages/home.jsx'
import PlayGame from './pages/Game/playGame.jsx'
import StartGame from './pages/Game/startGame.jsx';
import SetupGame from './pages/Game/setupGame.jsx';
import JoinGame from './pages/Game/joinGame.jsx';
import NotFound from './pages/notFound.jsx';
import './App.css';

export default function App() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play-game/:gameId" element={<PlayGame />} />
          <Route path="/start-game/:gameId" element={<StartGame />} />
          <Route path="/join-game" element={<JoinGame />} />
          <Route path="/setup-game" element={<SetupGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}