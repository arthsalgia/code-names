import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header.jsx'
import Home from './pages/home.jsx'
import PlayGame from './pages/playGame.jsx'
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
          <Route path="/play-game/:gameId" element={<PlayGame />} />
          <Route path="/host-game" element={<HostGame />} />
          <Route path="/join-game" element={<JoinGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}