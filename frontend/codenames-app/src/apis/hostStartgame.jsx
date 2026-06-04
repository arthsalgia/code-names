export default async function hostStartGame(gameId, turn) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/host-start-game?game_id=${gameId}&turn=${turn}`,
    {
      method: "POST",
    }
  );

  return await res.json();
}