export default async function getPlayer(gameId, playerId) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/games/${gameId}/player/${playerId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch player");
  }

  return await res.json(); 
}