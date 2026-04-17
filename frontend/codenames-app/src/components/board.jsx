import Card from "./card.jsx";
import "./board.css";
import { useState } from "react";

export default function Board({ wordlist }) {
  return (
    <div className="board">
      {wordlist.map((word, index) => (
        <Card key={index} word={word}/>
      ))}
    </div>
  );
}