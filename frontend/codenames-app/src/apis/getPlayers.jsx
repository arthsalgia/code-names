export default async function getPlayers(gameId) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/get-players?game_id=${gameId}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch players");
  }

  return await res.json();
}