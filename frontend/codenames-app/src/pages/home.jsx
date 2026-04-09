import { useNavigate } from 'react-router-dom';
import '../styles/global.css'
import './home.css'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Code Names</h1>
      <p>A fun word guessing game</p>
      <button className="button" onClick={() => navigate('/start-game')}>
        <div>
          <span>Start new game</span>
        </div>
      </button>
    </div>
  );
}