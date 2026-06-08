import "./Card.css";
import sharkImg from "../assets/shark.png";

export default function Card({ word, type, isSpy, guessed, onClick }) {
  return (
    <div
      className={`card ${
        guessed
          ? `card-guessed guessed-${type}`
          : isSpy
          ? `card-${type}`
          : ""
      }`}
      onClick={onClick}
    >
      {!guessed && (
        <div className="text">
          {word}
        </div>
      )}
    </div>
  );
}