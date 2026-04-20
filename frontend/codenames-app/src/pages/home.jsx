import './home.css'
import HomeButtons from '../components/homeButtons';

export default function Home() {
  return (
    <div className="home">
      <h1>Code Names</h1>
      <p>A fun word guessing game</p>
      <div className='home-buttons'>
        <HomeButtons/>
      </div>
    </div>
  );
}