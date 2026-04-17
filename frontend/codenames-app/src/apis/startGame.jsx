export default async function startGame() {
  const res = await fetch("https://arthsalgia-codenames.onrender.com/start-game", {
    method: "POST",
  });


  console.log("status:", res.status);
  console.log("headers:", res.headers);

  const text = await res.text();
  console.log("raw response:", text);
  const data = await res.json();
  return {
    gameId: data.game_id,
    turn: data.turn,
  };
}