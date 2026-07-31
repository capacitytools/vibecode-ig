"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [handle, setHandle] = useState("nasa"); // Default handle
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedHandle = localStorage.getItem("ig_handle") || "nasa";
    setHandle(savedHandle);
    fetchPosts(savedHandle);
  }, []);

  const fetchPosts = async (username: string) => {
    setLoading(true);
    // We use a free public CORS proxy to fetch Instagram's public JSON
    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.instagram.com/${username}/?__a=1&__d=dis`)}`);
      const data = await res.json();
      const edges = data.graphql.user.edge_owner_to_timeline_media.edges;
      const videoPosts = edges.filter((edge: any) => edge.node.is_video).slice(0, 6);
      setPosts(videoPosts);
    } catch (error) {
      // Fallback: If IG blocks the scraper, we show a manual embed option
      setPosts([]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">VibeCode IG Blog</h1>
        <p className="text-gray-600">Latest videos from <span className="font-bold text-black">@{handle}</span></p>
        <a href="/admin" className="text-sm text-purple-500 underline mt-2 inline-block">Admin Login</a>
      </header>

      {loading ? (
        <div className="text-center text-xl font-semibold text-gray-500 animate-pulse">Scanning Instagram...</div>
      ) : posts.length > 0 ? (
        <div className="max-w-4xl mx-auto grid gap-8">
          {posts.map((post, idx) => (
            <article key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">New Video Post #{idx + 1}</h2>
                <p className="text-gray-600 mb-4">{post.node.edge_media_to_caption.edges[0]?.node.text || "No caption"}</p>
              </div>
              {/* Official Instagram Embed - Plays directly on YOUR site */}
              <div className="bg-gray-100 flex justify-center p-4">                <iframe
                  src={`https://www.instagram.com/p/${post.node.shortcode}/embed`}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="rounded-lg max-w-md"
                ></iframe>
              </div>
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
                Hosted & Playable on VibeCode Platform
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-500 font-bold mb-4">Instagram blocked the auto-scraper (common).</p>
          <p className="mb-4 text-sm text-gray-600">As a creator, you can manually paste any post URL to host it instantly:</p>
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
    // Fixed regex to match both /p/ and /reel/ URLs
    const match = url.match(/instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/);
    if (match && match[2]) {
      setEmbedUrl(`https://www.instagram.com/${match[1]}/${match[2]}/embed`);
    } else {
      alert("Invalid Instagram URL. Please use format: https://instagram.com/p/ABC123 or https://instagram.com/reel/ABC123");
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="https://instagram.com/p/ABC123 or https://instagram.com/reel/ABC123" 
        className="w-full p-3 border rounded-lg mb-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />      <button 
        onClick={generateEmbed} 
        className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 active:bg-purple-800 cursor-pointer"
      >
        Generate Blog Post
      </button>
      {embedUrl && (
        <div className="mt-4 flex justify-center">
          <iframe 
            src={embedUrl} 
            width="100%" 
            height="500" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
            className="rounded-lg max-w-md"
          ></iframe>
        </div>
      )}
    </div>
  );
}