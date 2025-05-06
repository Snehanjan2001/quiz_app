"use client";

import { Crown } from "lucide-react"; // Only for the 👑 icon (Shadcn supports Lucide)

export default function LeaderboardPage() {
  const players = [
    { name: "Alice", score: 98 },
    { name: "Bob", score: 89 },
    { name: "Charlie", score: 82 },
    { name: "Diana", score: 77 },
    { name: "Eve", score: 71 },

    { name: "knc", score: 82 },
    { name: "Djbc iana", score: 77 },
    { name: "Eve", score: 71 },
  ];

  const sorted = players.sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-blue-400/30 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 tracking-wider text-blue-200 drop-shadow-md">
          🚀 Live Quiz Leaderboard
        </h1>

        <div className="space-y-5">
          {sorted.map((player, index) => (
            <div
              key={index}
              className={`flex justify-between items-center rounded-xl px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] ${
                index === 0
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 text-xl font-semibold">
                <span>#{index + 1}</span>
                {index === 0 && <Crown className="w-6 h-6 text-yellow-300" />}
              </div>
              <div className="text-xl font-medium tracking-wide">
                {player.name}
              </div>
              <div className="text-lg font-bold text-green-300">
                {player.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
