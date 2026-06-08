export default async function sendGuess(gameId, word, role, team) {
  const res = await fetch(
    "https://arthsalgia-codenames.onrender.com/make-guess",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_id: gameId,
        word: word,
        role : role,
        team : team
      }),
    }
  );

  return await res.json();
}