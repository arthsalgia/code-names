import Board from '../components/board.jsx'
import getCardsApi from '../apis/getCards';

export default function PlayGame() {
  const words = [
  "apple", "bridge", "crown", "dragon", "engine",
  "forest", "giant", "harbor", "island", "jungle",
  "knight", "laser", "mountain", "needle", "ocean",
  "piano", "queen", "rocket", "shadow", "tower",
  "umbrella", "village", "whale", "xray", "yacht"
  ];
  // this is technically not a page, must later fix this 
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(null);

  async function getCards() {
    try {

      const cards = await getCardsApi(startData.gameId)
      setCards(cards);
    }
    catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <Board wordlist={words} />

      {error && (
          <div className="error">
            <span className="error-message">* Username and team both required</span>
          </div>
        )}
    </div>
  );

}