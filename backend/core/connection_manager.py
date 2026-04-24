from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        self.active_connections = defaultdict(list)

    async def connect(self, websocket: WebSocket, game_id: str):
        await websocket.accept()
        self.active_connections[game_id].append(websocket)

    def disconnect(self, websocket: WebSocket, game_id: str):
        self.active_connections[game_id].remove(websocket)

    async def broadcast(self, game_id: str, message: dict):
        for connection in self.active_connections[game_id]:
            await connection.send_json(message)

manager = ConnectionManager()