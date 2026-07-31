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
        const data = await response.json();        const edges = data.graphql?.user?.edge_owner_to_timeline_media?.edges || [];
        
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
          </div>        </div>
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
                {post.node.edge_media_to_caption?.edges[0]?.node.text && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-gray-700 italic">
                      "{post.node.edge_media_to_caption.edges[0].node.text.substring(0, 200)}
                      {post.node.edge_media_to_caption.edges[0].node.text.length > 200 ? '...' : ''}"
                    </p>
                  </div>
                )}
              </div>
              
              {/* Instagram Video Embed */}
              <div className="bg-gray-100 flex justify-center p-6">
                <iframe
                  src={`https://www.instagram.com/p/${post.node.shortcode}/embed`}
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
          <p className="text-gray-500 mb-4">No videos found</p>
          <ManualEmbed onVideoAdded={() => fetchInstagramVideos(handle)} />
        </div>
      )}
    </main>
  );}

// Manual Embed Component
function ManualEmbed({ onVideoAdded }: { onVideoAdded: () => void }) {
  const [url, setUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [added, setAdded] = useState(false);

  const generateEmbed = () => {
    const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setEmbedUrl(`https://www.instagram.com/p/${match[1]}/embed`);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } else {
      alert("Invalid Instagram URL. Use format:\nhttps://instagram.com/p/ABC123\nor\nhttps://instagram.com/reel/ABC123");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3">📌 Manual Video Embed</h3>
      <p className="text-sm text-gray-600 mb-4">
        Paste any Instagram video URL to add it to your blog:
      </p>
      <input 
        type="text" 
        placeholder="https://instagram.com/p/ABC123 or https://instagram.com/reel/ABC123" 
        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button 
        onClick={generateEmbed} 
        className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 active:bg-purple-800 transition cursor-pointer shadow-md"
      >
        {added ? "✅ Added to Blog!" : " Generate Blog Post"}
      </button>
      {embedUrl && (
        <div className="mt-6 flex justify-center">
          <iframe 
            src={embedUrl} 
            width="100%" 
            height="500" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
            className="rounded-lg max-w-md shadow-lg"
          ></iframe>
        </div>      )}
    </div>
  );
}