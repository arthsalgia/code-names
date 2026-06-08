export default async function changeTurn(gameId) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/change-turn?game_id=${gameId}`,
    {
      method: "POST",
    }
  );

  return await res.json();
}