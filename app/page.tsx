"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [handle, setHandle] = useState("nasa");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const savedHandle = localStorage.getItem("ig_handle") || "nasa";
    setHandle(savedHandle);
    fetchVideos(savedHandle);
  }, []);

  const fetchVideos = async (username: string) => {
    setLoading(true);
    setError("");
    setIsDemo(false);
    
    try {
      const res = await fetch(`/api/scan?username=${username}`);
      const data = await res.json();
      
      if (data.success && data.videos && data.videos.length > 0) {
        setPosts(data.videos);
      } else if (data.videos && data.isDemo) {
        setPosts(data.videos);
        setIsDemo(true);
        setError(data.message);
      } else {
        setError(data.message || "No videos found");
        setPosts([]);
      }
    } catch (err) {
      setError("Failed to fetch videos");
      setPosts([]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">VibeCode IG Blog</h1>
        <p className="text-gray-600 mb-2">Latest videos from <span className="font-bold text-black">@{handle}</span></p>
        <button 
          onClick={() => fetchVideos(handle)}
          className="text-sm text-purple-600 underline hover:text-purple-800 mb-2"        >
          🔄 Refresh Videos
        </button>
        <div className="mt-2">
          <a href="/admin" className="text-sm text-purple-500 underline">Admin Login</a>
        </div>
      </header>

      {isDemo && (
        <div className="max-w-4xl mx-auto mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-800 font-semibold">⚠️ Demo Mode</p>
          <p className="text-sm text-yellow-700">{error}</p>
          <p className="text-xs text-gray-600 mt-2">
            Instagram blocks browser-based scraping. In production, add Instagram Graph API token to server-side route for reliable auto-fetching.
          </p>
        </div>
      )}

      {loading ? (
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-2xl font-semibold text-purple-600 mb-4">🔍 Scanning Instagram...</div>
          <div className="animate-pulse text-gray-500">Fetching latest videos from @{handle}</div>
        </div>
      ) : posts.length > 0 ? (
        <div className="max-w-4xl mx-auto grid gap-8">
          {posts.map((post, idx) => (
            <article key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  🎥 Video Post #{idx + 1}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-semibold">Posted by:</span> @{handle}
                </p>
                {post.caption && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-gray-700 italic">
                      "{post.caption.substring(0, 200)}
                      {post.caption.length > 200 ? '...' : ''}"
                    </p>
                  </div>
                )}
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>❤️ {post.likes?.toLocaleString() || 0} likes</span>
                  <span>💬 {post.comments?.toLocaleString() || 0} comments</span>
                </div>
              </div>
              
              <div className="bg-gray-100 flex justify-center p-6">
                <iframe                  src={`https://www.instagram.com/p/${post.shortcode}/embed`}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="rounded-lg max-w-md shadow-md"
                  title={`Instagram video ${idx + 1}`}
                ></iframe>
              </div>
              
              <div className="p-4 bg-purple-50 text-center text-sm text-purple-700 font-medium">
                ✅ Hosted & Playable on VibeCode Platform
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-500 mb-4">{error || "No videos found"}</p>
          <ManualEmbed />
        </div>
      )}
    </main>
  );
}

function ManualEmbed() {
  const [url, setUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const generateEmbed = () => {
    const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setEmbedUrl(`https://www.instagram.com/p/${match[1]}/embed`);
    } else {
      alert("Invalid Instagram URL. Use format:\nhttps://instagram.com/p/ABC123\nor\nhttps://instagram.com/reel/ABC123");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-3">📌 Manual Video Embed</h3>
      <input 
        type="text" 
        placeholder="https://instagram.com/p/ABC123" 
        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />      <button 
        onClick={generateEmbed} 
        className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 cursor-pointer"
      >
        Generate Blog Post
      </button>
      {embedUrl && (
        <div className="mt-6 flex justify-center">
          <iframe 
            src={embedUrl} 
            width="100%" 
            height="500" 
            frameBorder="0" 
            className="rounded-lg max-w-md"
          ></iframe>
        </div>
      )}
    </div>
  );
}