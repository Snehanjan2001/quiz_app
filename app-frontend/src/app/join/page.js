"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinQuizPage() {
  const [name, setName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleJoin = () => {
    setError(""); // reset old error

    if (!name || !sessionCode) {
      setError("❌ Please enter both name and session code.");
      return;
    }

    console.log("🛰️ Attempting WebSocket connection to:", sessionCode);

    try {
      const socket = new WebSocket(`ws://localhost:8000/ws/${sessionCode}/${name}`);


      socket.onopen = () => {
        console.log("WebSocket connection established.");

        // Save details
        localStorage.setItem("playerName", name);
        localStorage.setItem("sessionCode", sessionCode);

        setConnected(true);
        setWs(socket);

        // Redirect to quiz play page
        console.log("Navigating to /play");
        router.push("/join/play_quiz");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Received message from server:", data);
          alert(`📢 Question: ${data.question_text}`);
        } catch (e) {
          console.error("❌ Error parsing message:", event.data, e);
        }
      };

      socket.onerror = (event) => {
  console.error("❌ WebSocket connection failed:");
  console.dir(event); // logs full object in dev tools
  setError("WebSocket connection failed. Check if backend is running.");
};



      socket.onclose = (event) => {
        console.warn("🔌 WebSocket connection closed:", event.code, event.reason);
      };

      setWs(socket);
    } catch (e) {
      console.error("🚨 Unexpected WebSocket error:", e);
      setError(e.message || "Unknown error occurred while connecting.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 p-8 bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-600">Join Quiz</h1>

      <input
        className="border border-gray-300 rounded px-4 py-2 w-80"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border border-gray-300 rounded px-4 py-2 w-80"
        placeholder="Enter session code"
        value={sessionCode}
        onChange={(e) =>
          setSessionCode((e.target.value || "").toUpperCase())
        }
      />

      <button
        className={`px-6 py-2 rounded text-white ${
          connected ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handleJoin}
      >
        {connected ? "Connected ✅" : "Join"}
      </button>

      {error && (
        <div className="text-red-600 mt-4 font-medium text-center w-80">
          {error}
        </div>
      )}
    </div>
  );
}
