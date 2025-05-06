"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import confetti from "canvas-confetti";

export default function PlayPage() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  const [quiz, setQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // ✅ Fetch quiz from backend
  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/fetch_quiz/${quizId}`);
        const formattedQuiz = {
          id: res.data.quiz_id,
          title: res.data.quiz_name,
          questions: res.data.questions.map((q) => ({
            question: q.question_text,
            options: q.options.map((opt) => opt.option_value),
            correctAnswer: q.options.find((opt) => opt.is_correct)?.option_value,
          })),
        };
        setQuiz(formattedQuiz);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        alert("Could not load quiz. Please try again.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  // ✅ Timer countdown
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, submitted, quizStarted]);

  // ✅ Submit logic
  const handleSubmit = () => {
    setSubmitted(true);
    if (selected === quiz.questions[currentQuestion].correctAnswer) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ✅ Move to next question
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelected(null);
      setSubmitted(false);
      setTimeLeft(10);
    } else {
      alert("🎉 Quiz completed!");
    }
  };

  if (!quiz) return null;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">Quiz Code: {quizId}</h1>
        <h2 className="text-xl mb-8">{quiz.title}</h2>
        <Button
          onClick={() => setQuizStarted(true)}
          className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-md hover:bg-blue-100"
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isAnswerCorrect = (opt) => submitted && opt === question.correctAnswer;

  return (
    <div className="min-h-screen bg-blue-900 text-white p-6 flex flex-col items-center justify-center">
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
        {question.question}
      </h1>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !submitted && timeLeft > 0 && setSelected(opt)}
            className={`w-full py-6 px-4 rounded-lg border text-lg font-medium transition-all duration-300
              ${isAnswerCorrect(opt) ? "bg-green-500 text-white border-green-400" : ""}
              ${
                selected === opt && !submitted
                  ? "bg-blue-600 border-blue-400"
                  : "bg-blue-800 border-blue-700 hover:bg-blue-700"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        {!submitted && (
          <Button
            onClick={handleSubmit}
            className="bg-white text-blue-900 font-semibold text-lg px-6 py-3 rounded-md hover:bg-blue-100"
          >
            Show Answer
          </Button>
        )}

        {submitted && (
          <Button
            onClick={handleNext}
            className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            {currentQuestion === quiz.questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </Button>
        )}
      </div>

      {timeLeft === 0 && !submitted && (
        <p className="mt-6 text-red-300 text-lg font-medium">
          ⏱ Time's up! You didn’t answer in time.
        </p>
      )}
    </div>
  );
}
