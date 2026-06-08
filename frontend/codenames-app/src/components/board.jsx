import Card from "./Card.jsx";
import "./board.css";
import { useState } from "react";

export default function Board({ wordlist, isSpy, handleGuess }) {
  return (
    <div className="board">
      {wordlist.map((card) => (
        <Card
          key={card.word}
          word={card.word}
          type={card.card_type}
          guessed={card.guessed}
          isSpy={isSpy}
          onClick={() => handleGuess(card.word)}
        />
      ))}
    </div>
  );
}