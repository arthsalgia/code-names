import { useNavigate } from 'react-router-dom';

export default function StartGame() {
  const navigate = useNavigate();
  return (
    <div>
      <button className="button" onClick={() => navigate('/play-game')}>
        <div>
          <span>Play</span>
        </div>
      </button>
    </div>
  );
}