export default async function hostStartGame(gameId) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/host-start-game?game_id=${gameId}`,
    {
      method: "POST",
    }
  );
}