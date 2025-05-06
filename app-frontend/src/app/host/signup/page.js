"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HostSignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSignup = async () => {
  if (!username || !password) {
    alert("Please enter both Username and Password.");
    return;
  }

  try {
    console.log("Signing up as:", username);

    await API.post("/api/signup", {
      username,
      password,
    });

    alert("Signed up successfully!");
    router.push("/host/login");  // Redirect to login after signup
  } catch (err) {
    console.error("Signup failed:", err);
    alert("Signup failed. Username may already be taken.");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-6 py-16">
      <h1 className="text-4xl font-bold text-blue-800 mb-20 text-center tracking-tight">
        📝 Host Signup
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white border border-blue-300 text-blue-800 placeholder:text-blue-400 py-8 text-xl rounded-md"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white border border-blue-300 text-blue-800 placeholder:text-blue-400 py-8 text-xl rounded-md"
        />

        <Button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-12 text-2xl rounded-md shadow-xl transition-all"
        >
          Signup
        </Button>

        <div className="text-center mt-4">
          <p className="text-blue-700 text-lg">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/host/login")}
              className="underline cursor-pointer font-semibold hover:text-blue-900"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
