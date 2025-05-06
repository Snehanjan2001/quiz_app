"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function HostSessionPage() {
  const searchParams = useSearchParams();
  const sessionCode = searchParams.get("sessionCode");

  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const res = await API.post(
        `/host/start_question/${sessionCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Next Question: ", res.data);
      setQuestion(res.data);
      setQuestionNumber(res.data.question_number);
      setShowingAnswer(false);
      setTimeLeft(10);
    } catch (err) {
      console.error("Error fetching next question:", err);
      alert(err.response?.data?.detail || "Could not load next question.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !showingAnswer) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showingAnswer]);

  useEffect(() => {
    if (timeLeft === 0 && !showingAnswer) {
      setTimeout(() => {
        setShowingAnswer(true);
      }, 1000);
    }
  }, [timeLeft, showingAnswer]);

  const handleShowAnswer = () => {
    setShowingAnswer(true);
  };

  const handleNext = () => {
    fetchNextQuestion();
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-blue-200 mb-4">
        Hosting Session: {sessionCode}
      </h1>

      {!question && (
        <Button
          onClick={fetchNextQuestion}
          disabled={loading}
          className="mb-8 bg-white text-blue-900 font-semibold text-lg px-6 py-3 rounded-md hover:bg-blue-100"
        >
          {loading ? "Loading..." : "Start Quiz"}
        </Button>
      )}

      {question && (
        <>
          <div className="text-sm text-blue-200 mb-2 tracking-widest uppercase">
            Time Remaining
          </div>
          <div
            className={`text-5xl font-bold mb-6 ${
              timeLeft <= 3 ? "text-red-400" : "text-white"
            }`}
          >
            {timeLeft}s
          </div>

          <h1 className="text-3xl font-semibold mb-8 text-center">
            Q{questionNumber}: {question.question_text}
          </h1>

          <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
            {question.options.map((opt, idx) => {
              const isCorrect = showingAnswer && opt.is_correct;
              return (
                <div
                  key={idx}
                  className={`w-full py-6 px-4 rounded-lg border text-lg font-medium transition-all duration-300 ${
                    isCorrect
                      ? "bg-green-500 text-white border-green-400"
                      : "bg-blue-800 border-blue-700"
                  }`}
                >
                  {opt.option_value}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-10">
            <Button
              onClick={handleShowAnswer}
              disabled={showingAnswer}
              className={`text-lg px-6 py-3 font-semibold rounded-md ${
                showingAnswer
                  ? "bg-gray-400 text-gray-200"
                  : "bg-white text-blue-900 hover:bg-blue-100"
              }`}
            >
              Show Answer
            </Button>

            <Button
              onClick={handleNext}
              disabled={!showingAnswer}
              className={`text-lg px-6 py-3 font-semibold rounded-md ${
                showingAnswer
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Next Question
            </Button>
          </div>

          {timeLeft === 0 && !showingAnswer && (
            <p className="mt-6 text-red-300 text-lg font-medium">
              ⏱ Time's up! Click "Show Answer".
            </p>
          )}
        </>
      )}
    </div>
  );
}
