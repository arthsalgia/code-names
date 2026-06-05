export default async function sendHint(gameId, hint, team) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/send-hint?game_id=${gameId}&hint=${hint}&team=${team}`,
    {
      method: "POST",
    }
  );

  return await res.json();
}