import './notFound.css'

import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>The page you are looking for was not found</h2>
      <button className="button" onClick={() => navigate("/")}>
        <div><span>Take me home</span></div>
      </button>
    </div>
  );
}