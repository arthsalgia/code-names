export default async function getCards(gameId) {
  const res = await fetch(
    `https://arthsalgia-codenames.onrender.com/get-cards?game_id=${gameId}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Cards");
  }

  return await res.json();
}