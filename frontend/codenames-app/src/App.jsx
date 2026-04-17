import { Routes, Route } from 'react-router-dom';
import Game from './pages/game.jsx'
import Header from './components/header/header.jsx'
import Home from './pages/home.jsx'
import JoinGame from './pages/Game/joinGame.jsx';
import HostGame from './pages/Game/hostGame.jsx';
import NotFound from './pages/notFound.jsx';
import './App.css';

export default function App() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play-game" element={<Game />} />
          <Route path="/host-game" element={<HostGame />} />
          <Route path="/join-game" element={<JoinGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}