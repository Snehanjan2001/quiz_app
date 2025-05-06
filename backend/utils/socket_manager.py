from fastapi.websockets import WebSocket
from typing import Dict, List

class SocketManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, session_code: str, websocket: WebSocket):
        await websocket.accept()
        if session_code not in self.active_connections:
            self.active_connections[session_code] = []
        self.active_connections[session_code].append(websocket)
        print(f"Connected: {session_code} — {len(self.active_connections[session_code])} clients")

    def disconnect(self, session_code: str, websocket: WebSocket):
        if session_code in self.active_connections:
            self.active_connections[session_code].remove(websocket)
            print(f"Disconnected: {session_code} — {len(self.active_connections[session_code])} clients")

    async def broadcast(self, session_code: str, message: dict):
        if session_code in self.active_connections:
            print(f"📡 Broadcasting to {len(self.active_connections[session_code])} clients")
            for connection in self.active_connections[session_code]:
                await connection.send_json(message)
        else:
            print(f"No active connections in session {session_code}")

# ✅ Singleton instance
socket_manager = SocketManager()
