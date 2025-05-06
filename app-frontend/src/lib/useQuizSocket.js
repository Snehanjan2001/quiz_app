import { useEffect, useState } from "react";

export function useQuizSocket(sessionCode) {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (!sessionCode) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/${sessionCode}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 New Question from Host:", data);
        setQuestion(data);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("📴 WebSocket disconnected");

    return () => {
      socket.close();
    };
  }, [sessionCode]);

  return { question };
}
