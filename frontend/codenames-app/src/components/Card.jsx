import "./Card.css";
import sharkImg from "../assets/shark.png";

export default function Card({ word, type, isSpy, guessed }) {
  return (
    <div className={`card ${(isSpy || guessed) ? `card-${type}` : ''}`}>
      {guessed ? (
        <div className="guessed"></div>
      ) : (
        <div className="text">
          {word}
        </div>
      )}
    </div>
  );
}