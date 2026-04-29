import "./Card.css";
import sharkImg from "../assets/shark.png";

export default function Card({ word }) {
  return (
    <div className="card">
      <img className="card-bg-img" src={sharkImg} alt="shark" />
      <div className="text">
        <div className="h3">{word}</div>
      </div>
    </div>
  );
}