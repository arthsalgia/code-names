export default async function updateHost({id, role, team, gameId}) {
  const res = await fetch("https://arthsalgia-codenames.onrender.com/update-host", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      role: role,
      team: team,
      game_id: gameId,
    }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.detail || "Failed to update host");
  }
  
  return data
}