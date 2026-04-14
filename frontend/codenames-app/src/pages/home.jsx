import './home.css'
import StartGame from '../pages/startGame';

export default function Home() {
  return (
    <div className="home">
      <h1>Code Names</h1>
      <p>A fun word guessing game</p>
      <div className='home-buttons'>
        <StartGame/>
      </div>
    </div>
  );
}