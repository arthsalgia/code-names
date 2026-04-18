export default async function startGame() {
  const res = await fetch("https://arthsalgia-codenames.onrender.com/start-game", {
    method: "POST",
  });
  
  const data = await res.json();
  return {
    gameId: data.game_id,
    turn: data.turn,
  };
}