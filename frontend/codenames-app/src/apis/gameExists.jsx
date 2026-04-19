export default async function gameExists(gameId) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/game-exists?game_id=${gameId}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get game exists api");
  }

  return await res.json();
}