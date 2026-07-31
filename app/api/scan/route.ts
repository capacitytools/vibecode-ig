import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'nasa';

  try {
    // Try fetching Instagram data server-side
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Instagram blocked the request');
    }

    const data = await response.json();
    const edges = data.graphql?.user?.edge_owner_to_timeline_media?.edges || [];
    
    // Filter only video posts
    const videoPosts = edges
      .filter((edge: any) => edge.node.is_video)
      .slice(0, 6)
      .map((edge: any) => ({
        shortcode: edge.node.shortcode,
        caption: edge.node.edge_media_to_caption?.edges[0]?.node.text || '',
        displayUrl: edge.node.display_url,
        videoUrl: edge.node.video_url,
        timestamp: edge.node.taken_at_timestamp,
        likes: edge.node.edge_media_preview_like.count,
        comments: edge.node.edge_media_to_comment.count,
      }));

    if (videoPosts.length > 0) {
      return NextResponse.json({ 
        success: true, 
        handle: username, 
        videos: videoPosts 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'No videos found for this handle' 
      });
    }
  } catch (error) {
    // Fallback: Return demo videos to show the platform works
    const demoVideos = [
      {
        shortcode: 'C5yW8xKvX2T',
        caption: 'Demo Video 1 - Instagram auto-scraper is blocked by CORS. This demo shows how the platform displays videos.',
        displayUrl: '',
        videoUrl: '',
        timestamp: Date.now() / 1000,
        likes: 1234,
        comments: 56,
      },
      {
        shortcode: 'C8xQZKjvM2L',
        caption: 'Demo Video 2 - In production, use Instagram Graph API token for reliable auto-scraping.',
        displayUrl: '',
        videoUrl: '',
        timestamp: Date.now() / 1000 - 86400,
        likes: 5678,
        comments: 123,
      },
    ];

    return NextResponse.json({ 
      success: false, 
      message: 'Instagram auto-fetch blocked (CORS). Showing demo mode.',
      videos: demoVideos,
      isDemo: true
    });
  }
}