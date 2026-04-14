import { Routes, Route } from 'react-router-dom';
import StartGame from './pages/startGame.jsx';
import Game from './pages/game.jsx'
import Header from './components/header/header.jsx'
import Home from './pages/home.jsx'
import './App.css';

export default function App() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play-game" element={<Game />} />
        </Routes>
      </div>
    </>
  );
}