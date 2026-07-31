"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [handle, setHandle] = useState("nasa");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedHandle = localStorage.getItem("ig_handle") || "nasa";
    setHandle(savedHandle);
    fetchInstagramVideos(savedHandle);
  }, []);

  const fetchInstagramVideos = async (username: string) => {
    setLoading(true);
    setError("");
    
    try {
      // Method 1: Try fetching via public Instagram endpoint
      const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const edges = data.graphql?.user?.edge_owner_to_timeline_media?.edges || [];
      
      // Filter only video posts
      const videoPosts = edges
        .filter((edge: any) => edge.node.is_video)
        .slice(0, 6);
      
      if (videoPosts.length > 0) {
        setPosts(videoPosts);
      } else {
        setError("No videos found for this handle");
        setPosts([]);
      }
    } catch (err) {
      // Fallback: Try CORS proxy
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.instagram.com/${username}/?__a=1`)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const edges = data.graphql?.user?.edge_owner_to_timeline_media?.edges || [];
        
        const videoPosts = edges
          .filter((edge: any) => edge.node.is_video)
          .slice(0, 6);
        
        if (videoPosts.length > 0) {
          setPosts(videoPosts);
        } else {
          setError("Auto-fetch blocked. Please use manual embed below.");
          setPosts([]);
        }
      } catch (e) {
        setError("Instagram auto-fetch is blocked. Use manual embed below to add videos.");
        setPosts([]);
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">VibeCode IG Blog</h1>
        <p className="text-gray-600 mb-2">Latest videos from <span className="font-bold text-black">@{handle}</span></p>
        <button 
          onClick={() => fetchInstagramVideos(handle)}
          className="text-sm text-purple-600 underline hover:text-purple-800"
        >
           Refresh Videos
        </button>
        <div className="mt-2">
          <a href="/admin" className="text-sm text-purple-500 underline">Admin Login</a>
        </div>
      </header>

      {loading ? (
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-2xl font-semibold text-purple-600 mb-4"> Scanning Instagram...</div>
          <div className="animate-pulse text-gray-500">Fetching latest videos from @{handle}</div>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 font-semibold mb-2">⚠️ {error}</p>
            <p className="text-sm text-gray-600 mb-4">
              Instagram blocks automated scraping from external sites. Use the manual embed below:
            </p>
            <ManualEmbed onVideoAdded={() => fetchInstagramVideos(handle)} />