"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function PlayPage() {
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionCode = localStorage.getItem("sessionCode");
    const playerName = localStorage.getItem("playerName");

    if (!sessionCode || !playerName) {
      router.push("/join");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionCode}/${playerName}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setQuestion(data);
        setSelected(null);
        setAnswered(false);
        setTimeLeft(10);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    ws.onopen = () => console.log("✅ WebSocket reconnected");
    ws.onerror = (e) => console.error("WebSocket error", e);
    ws.onclose = () => console.log("🔌 WebSocket closed");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (question && timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, question, answered]);

  const handleSubmit = () => {
    if (!selected || !question) return;

    const isCorrect = selected.is_correct;
    if (isCorrect) {
      confetti();
    } else {
      alert("❌ Wrong Answer");
    }

    setAnswered(true);

    // TODO: send answer to backend if needed
  };

  if (!question) return <div className="p-10 text-xl">⏳ Waiting for question...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-blue-50 p-6">
      <h2 className="text-2xl font-bold text-blue-800">Question {question.question_number}</h2>
      <p className="text-lg text-center">{question.question_text}</p>

      <div className="w-full max-w-md flex flex-col gap-2 mt-4">
        {question.options.map((opt, index) => (
          <button
            key={index}
            className={`border px-4 py-2 rounded text-left ${
              selected?.option_value === opt.option_value ? "bg-blue-300" : "bg-white"
            }`}
            disabled={answered || timeLeft === 0}
            onClick={() => setSelected(opt)}
          >
            {opt.option_value}
          </button>
        ))}
      </div>

      <p className="text-gray-600 mt-2">⏱ Time left: {timeLeft} seconds</p>

      <button
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
        disabled={!selected || answered || timeLeft === 0}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
