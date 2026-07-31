"use client";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  url: string;
  platform: 'instagram' | 'youtube' | 'facebook';
  caption: string;
  author: string;
  date: string;
  videoId: string;
}

export default function Home() {
  const [handle, setHandle] = useState("nasa");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");

  useEffect(() => {
    const savedHandle = localStorage.getItem("ig_handle") || "nasa";
    setHandle(savedHandle);
    
    const savedPosts = localStorage.getItem("vibecode_posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const detectPlatform = (url: string): 'instagram' | 'youtube' | 'facebook' | null => {
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    return null;
  };

  const extractVideoId = (url: string, platform: string): string => {
    if (platform === 'instagram') {
      const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : '';
    }
    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
      return match ? match[1] : '';
    }
    if (platform === 'facebook') {
      const match = url.match(/facebook\.com\/(?:[^\/]+\/videos\/|watch\/|video\/)(\d+|[^\/]+)/);
      return match ? match[1] : url;
    }
    return '';  };

  const addBlogPost = () => {
    const platform = detectPlatform(urlInput);
    
    if (!platform) {
      alert("Please enter a valid URL from Instagram, YouTube, or Facebook!");
      return;
    }

    const videoId = extractVideoId(urlInput, platform);
    
    if (!videoId) {
      alert("Could not extract video ID. Please check the URL format.");
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      url: urlInput,
      platform,
      videoId,
      caption: captionInput || `New video post from @${handle}`,
      author: handle,
      date: new Date().toLocaleDateString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("vibecode_posts", JSON.stringify(updatedPosts));
    
    setUrlInput("");
    setCaptionInput("");
  };

  const deletePost = (id: string) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("vibecode_posts", JSON.stringify(updatedPosts));
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return '📸';
      case 'youtube': return '🎬';
      case 'facebook': return '👥';
      default: return '';
    }
  };
  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'instagram': return 'from-purple-500 to-pink-500';
      case 'youtube': return 'from-red-600 to-red-700';
      case 'facebook': return 'from-blue-600 to-blue-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const renderVideoEmbed = (post: BlogPost) => {
    if (post.platform === 'instagram') {
      return (
        <iframe
          src={`https://www.instagram.com/p/${post.videoId}/embed/captioned/`}
          width="100%"
          height="650"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          className="rounded-lg max-w-md shadow-md bg-white"
        ></iframe>
      );
    }
    
    if (post.platform === 'youtube') {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${post.videoId}?rel=0`}
          width="100%"
          height="450"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg max-w-2xl shadow-md"
        ></iframe>
      );
    }
    
    if (post.platform === 'facebook') {
      return (
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(post.url)}&show_text=0&width=560`}
          width="100%"
          height="500"
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          className="rounded-lg max-w-md shadow-md"
        ></iframe>
      );    }
    
    return null;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">VibeCode Video Blog</h1>
        <p className="text-gray-600 mb-3">Hosting videos from <span className="font-bold text-black">@{handle}</span></p>
        <div className="flex justify-center gap-2 text-sm flex-wrap">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">📸 Instagram</span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">🎬 YouTube</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">👥 Facebook</span>
        </div>
        <div className="mt-3">
          <a href="/admin" className="text-purple-600 underline hover:text-purple-800 text-sm">⚙️ Admin Panel</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        
        {/* Creator Studio */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg text-lg">🎨</span> 
            Creator Studio: Add Video Blog Post
          </h2>
          <p className="text-sm text-gray-500 mb-4">Paste any Instagram, YouTube, or Facebook video URL to instantly host it.</p>
          
          <input 
            type="text" 
            placeholder="Paste video URL (Instagram / YouTube / Facebook)" 
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition cursor-pointer shadow-md"
          >
            🚀 Publish to Platform
          </button>        </div>

        {/* Blog Posts Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No video posts yet.</p>
            <p className="text-gray-400 text-sm mt-2">Use the Creator Studio above to add your first video!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Blog Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{post.platform} Video</h2>
                        <p className="text-xs text-gray-400">By @{post.author} • {post.date}</p>
                      </div>
                    </div>
                    <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-600 text-sm px-3 py-1 bg-red-50 rounded">Delete</button>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-3">{post.caption}</p>
                </div>
                
                {/* Playable Video Embed */}
                <div className={`bg-gradient-to-br ${getPlatformColor(post.platform)} p-1`}>
                  <div className="bg-gray-100 flex justify-center p-6">
                    {renderVideoEmbed(post)}
                  </div>
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