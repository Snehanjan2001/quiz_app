"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = parseInt(value);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = () => {
    const quiz = { title: quizTitle, questions };
    console.log("Quiz Saved:", quiz);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Create New Quiz</h1>
          <p className="text-blue-600 text-lg">Design questions, select correct answers, and publish!</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100">
          <Label className="text-blue-900 text-lg mb-2 block">Quiz Title</Label>
          <Input
            placeholder="Enter quiz title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="py-4 text-lg border-blue-300"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-800">Question {qIndex + 1}</h2>
              {questions.length > 1 && (
                <Button
                  variant="destructive"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-sm"
                >
                  Remove
                </Button>
              )}
            </div>

            <Input
              placeholder="Enter question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="py-4 border-blue-300"
            />

            <div className="space-y-2">
              <Label className="text-blue-800 font-medium">Select Correct Option</Label>
              <RadioGroup
                defaultValue={q.correctAnswer.toString()}
                onValueChange={(val) => handleCorrectChange(qIndex, val)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={oIndex.toString()}
                        id={`q${qIndex}-opt${oIndex}`}
                      />
                      <Input
                        id={`q${qIndex}-opt${oIndex}`}
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="py-3 border-blue-300 w-full"
                      />
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-6">
          <Button onClick={addQuestion} className="px-6 py-4 text-lg rounded bg-blue-600 hover:bg-blue-700 text-white shadow">
            ➕ Add Question
          </Button>
          <Button onClick={handleSubmit} className="px-6 py-4 text-lg rounded bg-green-600 hover:bg-green-700 text-white shadow">
            💾 Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}