"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export default function HostDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const router = useRouter();

  // ✅ Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You're not logged in.");
        router.push("/host/login");
        return;
      }

      try {
        const response = await API.get("/fetch_quiz");
        setQuizzes(response.data.quizzes);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        alert("Session expired. Please login again.");
        router.push("/host/login");
      }
    };

    fetchQuizzes();
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/host/login");
  };

  // ✅ Handle preview of specific quiz
  const handlePreview = async (quiz) => {
    try {
      const res = await API.get(`/fetch_quiz/${quiz.quiz_id}`);
      setSelectedQuiz({
        quiz_name: res.data.quiz_name,
        quiz_id: res.data.quiz_id,
      });
      setPreviewQuestions(res.data.questions);
    } catch (err) {
      console.error("Failed to load quiz preview:", err);
      alert("Could not load quiz details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-blue-800">🎯 Host Dashboard</h1>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/host/create_quiz")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold px-6 py-4 rounded shadow-md transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Create Quiz
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-blue-700 border-blue-700 hover:bg-blue-100 font-semibold px-6 py-4 rounded-md"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-blue-200 text-blue-900 text-left text-lg">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Quiz Title</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-blue-800 text-md">
            {quizzes.map((quiz, index) => (
              <tr
                key={quiz.quiz_id}
                className={`hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-blue-50"
                }`}
              >
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4">{quiz.quiz_name}</td>
                <td className="px-6 py-4">{quiz.created_at || "--"}</td>
                <td className="px-6 py-4 flex items-center justify-center gap-4">
                  <Button
                      onClick={async () => {
                        try {
                          const res = await API.post(`/host/start_session/${quiz.quiz_id}`);
                          const sessionCode = res.data.session_code;
                          router.push(`/host/session?sessionCode=${sessionCode}`);
                        } catch (err) {
                          console.error("Failed to start session:", err);
                          alert("Could not start session. Try again.");
                        }
                      }}
                      variant="outline"
                      className="text-sm px-4 py-2 rounded"
                    >
                      ▶ Play
                    </Button>


                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handlePreview(quiz)}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        👁️ Preview
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-blue-800">
                          {selectedQuiz
                            ? `Quiz: ${selectedQuiz.quiz_name}`
                            : "Quiz Preview"}
                        </DialogTitle>
                      </DialogHeader>

                      {previewQuestions.length === 0 ? (
                        <div className="text-gray-500 mt-4">
                          Loading questions...
                        </div>
                      ) : (
                        <div className="space-y-6 mt-6">
                          {previewQuestions.map((q, index) => (
                            <div key={index}>
                              <p className="font-semibold mb-2 text-blue-800">
                                {`Q${index + 1}: ${q.question_text}`}
                              </p>
                              <div className="flex flex-col gap-2">
                                {q.options.map((option, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    className={`justify-start text-left rounded ${
                                      option.is_correct ? "bg-green-100" : ""
                                    }`}
                                  >
                                    {option.option_value}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
