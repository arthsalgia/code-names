export default async function addPlayer({name, role, host, team, gameId}) {
  const res = await fetch("https://arthsalgia-codenames.onrender.com/add-player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      role: role,
      host: host,
      team: team,
      game_id: gameId,
    }),
  });
  
  const data = await res.json();
  return data.id // added player id
}