import { use, useState } from 'react';
import Board from '../components/board.jsx'
import getCardsApi from '../apis/getCards';

export default function PlayGame() {
  // this is technically not a page, must later fix this 
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(false);

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


      {error && (
          <div className="error">
            <span className="error-message">* Username and team both required</span>
          </div>
        )}
    </div>
  );

}