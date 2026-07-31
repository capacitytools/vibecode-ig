"use client";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  shortcode: string;
  caption: string;
  author: string;
  date: string;
}

export default function Home() {
  const [handle, setHandle] = useState("nasa");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");

  useEffect(() => {
    const savedHandle = localStorage.getItem("ig_handle") || "nasa";
    setHandle(savedHandle);
    
    // Load saved blog posts
    const savedPosts = localStorage.getItem("vibecode_posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const addBlogPost = () => {
    // Extract shortcode from URL (works for /p/ and /reel/)
    const match = urlInput.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    
    if (!match || !match[1]) {
      alert("Please enter a valid Instagram video URL!");
      return;
    }

    const shortcode = match[1];
    const newPost: BlogPost = {
      id: Date.now().toString(),
      shortcode: shortcode,
      caption: captionInput || `New video post from @${handle}`,
      author: handle,
      date: new Date().toLocaleDateString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("vibecode_posts", JSON.stringify(updatedPosts));
        // Clear inputs
    setUrlInput("");
    setCaptionInput("");
  };

  const deletePost = (id: string) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("vibecode_posts", JSON.stringify(updatedPosts));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">VibeCode IG Blog</h1>
        <p className="text-gray-600">Hosting videos from <span className="font-bold text-black">@{handle}</span></p>
        <div className="mt-3 flex justify-center gap-4 text-sm">
          <a href="/admin" className="text-purple-600 underline hover:text-purple-800">⚙️ Admin Panel</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        
        {/* Creator Studio (Add New Post) */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-purple-100 p-2 rounded-lg">️</span> Creator Studio: Add New Blog Post
          </h2>
          <p className="text-sm text-gray-500 mb-4">Paste any Instagram video link to instantly host it on your platform.</p>
          
          <input 
            type="text" 
            placeholder="Paste Instagram URL (e.g., https://instagram.com/reel/...)" 
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <textarea 
            placeholder="Write a blog caption for this video..." 
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
            value={captionInput}
            onChange={(e) => setCaptionInput(e.target.value)}
          />
          <button 
            onClick={addBlogPost} 
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 transition cursor-pointer shadow-md"
          >
            🚀 Publish to Platform
          </button>        </div>

        {/* Blog Posts Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No blog posts yet.</p>
            <p className="text-gray-400 text-sm mt-2">Use the Creator Studio above to add your first video!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Blog Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Video Post by @{post.author}</h2>
                      <p className="text-xs text-gray-400 mt-1">Published on {post.date}</p>
                    </div>
                    <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{post.caption}</p>
                </div>
                
                {/* Playable Video Embed */}
                <div className="bg-gray-100 flex justify-center p-6">
                  <iframe
                    src={`https://www.instagram.com/p/${post.shortcode}/embed/captioned/`}
                    width="100%"
                    height="650"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                    className="rounded-lg max-w-md shadow-md bg-white"
                    title="Instagram Video"
                  ></iframe>
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-purple-50 text-center text-sm text-purple-700 font-medium border-t border-purple-100">
                  ✅ Hosted & Fully Playable on VibeCode Platform
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}