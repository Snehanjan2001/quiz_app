"use client";
import { Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-6 py-16">
      <h1 className="text-4xl font-bold text-blue-800 mb-20 text-center tracking-tight">
        Quiz Platform
      </h1>

      <div className="flex flex-col gap-8 w-full max-w-md">
        {/* Play Quiz */}
        <Button onClick = {()=> router.push("/join")} 
        className="flex flex-row items-center justify-center gap-4 w-full py-14 px-6 text-2xl font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg">
          <Play className="w-10 h-10" />
          Play Quiz
        </Button>

        {/* Start Quiz */}
        <Button
          onClick = {()=> router.push("/host/login")}
          variant="outline"
          className="flex flex-row items-center justify-center gap-4 w-full py-14 px-6 text-2xl font-semibold rounded-md border-2 border-blue-500 text-blue-700 hover:bg-blue-100 transition-all duration-300 shadow"
        >
          <Settings className="w-10 h-10" />
          Start Quiz (Host)
        </Button>
      </div>
    </div>
  );
}
