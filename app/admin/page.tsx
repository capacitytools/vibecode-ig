"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Simple password for the challenge demo
    if (password === "vibe2024") {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password!");
    }
  };

  const saveHandle = () => {
    localStorage.setItem("ig_handle", newHandle.replace("@", ""));
    alert("Handle updated! Redirecting to homepage...");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">
            Unlock
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Change Instagram Handle</h2>
        <p className="text-gray-600 mb-4 text-sm">Enter a new handle to fetch their videos instantly.</p>
        <input 
          type="text" 
          placeholder="e.g., nasa or cristiano" 
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setNewHandle(e.target.value)}
        />
        <button onClick={saveHandle} className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold">
          Save & Update Platform
        </button>
        <button onClick={() => router.push("/")} className="w-full mt-2 text-gray-500 underline">
          Back to Homepage
        </button>
      </div>
    </main>
  );
}