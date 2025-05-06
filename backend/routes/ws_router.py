from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from utils.socket_manager import socket_manager

router = APIRouter()

@router.websocket("/ws/{session_code}/{username}")
async def websocket_endpoint(websocket: WebSocket, session_code: str, username: str):
    await websocket.accept()
    print(f"{username} connected to {session_code}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"{username} disconnected")
