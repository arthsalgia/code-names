import "./Card.css";
import sharkImg from "../assets/shark.png";

export default function Card({ word, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <img className="card-bg-img" src={sharkImg} alt="shark" />
      <div className="text">
        <div className="h3">{word}</div>
      </div>
    </div>
  );
}