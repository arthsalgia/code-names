import { useParams } from "react-router-dom";

export default async function getCards() {
  const { gameId } = useParams();
  const res = await fetch(`https://arthsalgia-codenames.onrender.com/get-cards?game_id=${gameId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cards");
  }

  const data = await res.json();
  return data
}