"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (password === "vibe2024") {
      setIsAuthenticated(true);
      const savedHandle = localStorage.getItem("ig_handle") || "";
      setNewHandle(savedHandle);
    } else {
      alert("Wrong password!");
    }
  };

  const saveHandle = () => {
    const cleanHandle = newHandle.replace("@", "").trim();
    if (!cleanHandle) {
      alert("Please enter a valid Instagram handle");
      return;
    }
    localStorage.setItem("ig_handle", cleanHandle);
    alert(`✅ Handle updated to @${cleanHandle}!\n\nThe homepage will now auto-scan this account.`);
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-2 text-center text-purple-700">🔐 Admin Access</h2>
          <p className="text-gray-500 text-center mb-6 text-sm">Enter password to manage your blog</p>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin} 
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition cursor-pointer shadow-md"
          >
            🔓 Unlock Admin Panel
          </button>        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-purple-700">⚙️ Admin Panel</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Change Instagram handle to auto-scan new videos
        </p>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Instagram Handle:
          </label>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-300">
            <span className="text-gray-500 mr-1">@</span>
            <input 
              type="text" 
              placeholder="nasa" 
              className="flex-1 bg-transparent outline-none text-lg"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter username without @ symbol (e.g., nasa, cristiano, wizkofficial)
          </p>
        </div>

        <button 
          onClick={saveHandle} 
          className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition cursor-pointer shadow-lg mb-3"
        >
          💾 Save & Update Platform
        </button>
        
        <button 
          onClick={() => router.push("/")} 
          className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
        >
          ← Back to Homepage
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-1">💡 How it works:</p>
          <p className="text-xs text-blue-700">
            After saving, the homepage will automatically scan and fetch the latest videos from this Instagram account.          </p>
        </div>
      </div>
    </main>
  );
}