export default async function hostStartGame(gameId) {
  const res = await fetch("https://arthsalgia-codenames.onrender.com/host-start-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ game_id: gameId }),
  });
  
  if (!res.ok) {
    throw new Error(data.detail || "Failed to add player");
  }
}