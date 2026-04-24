from fastapi import WebSocket, WebSocketDisconnect
from ..core.connection_manager import manager
from ..app import app

@app.websocket("/ws/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str):
    await manager.connect(websocket, game_id)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket, game_id)