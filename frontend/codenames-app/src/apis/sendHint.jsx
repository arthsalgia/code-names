export default async function sendHint(gameId, hint, NOG, team) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/send-hint?game_id=${gameId}&hint=${hint}&NOG=${NOG}&team=${team}`,
    {
      method: "POST",
    }
  );

  return await res.json();
}