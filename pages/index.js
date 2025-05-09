import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [twitterKey, setTwitterKey] = useState('');
  const [twitterSecret, setTwitterSecret] = useState('');
  const [twitterToken, setTwitterToken] = useState('');
  const [twitterTokenSecret, setTwitterTokenSecret] = useState('');
  const [topic, setTopic] = useState('');
  const [tweet, setTweet] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  async function generateTweet() {
    setError('');
    setStatus('');
    setGenLoading(true);
    setTweet('');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'you tweet like a funny real twitter user' },
            { role: 'user', content: `make a tweet about ${topic}. keep it short n like a human made it` }
          ],
          temperature: 0.8,
          max_tokens: 60
        })
      });
      const data = await response.json();
      if(data.error) throw new Error(data.error.message);
      setTweet(data.choices[0].message.content.trim());
    } catch (e) {
      setError('Failed to generate tweet: ' + e.message);
    } finally {
      setGenLoading(false);
    }
  }

  async function postTweet() {
    setError('');
    setStatus('');
    setPosting(true);
    try {
      // Twitter API v2 does not allow posting tweets with just keys in browser due to CORS and OAuth 1.0a
      // So, we simulate posting (demo only)
      setTimeout(() => {
        setStatus('Tweet posted! (Simulation: Twitter API posting is not possible from static sites)');
        setPosting(false);
      }, 1200);
      // In a real deployment, you would need a backend API route to securely post to Twitter
    } catch (e) {
      setError('Failed to post tweet: ' + e.message);
      setPosting(false);
    }
  }

  return (
    <div className="main-container">
      <Image
        src="/profile.jpg"
        alt="Profile Photo"
        width={120}
        height={120}
        className="profile-pic"
        priority
      />
      <h1>TweetBot</h1>
      <div className="section">
        <div className="section-header">API Keys</div>
        <div className="gray-box">
          <input
            type="password"
            placeholder="OpenAI API Key"
            value={openaiKey}
            onChange={e => setOpenaiKey(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Twitter API Key"
            value={twitterKey}
            onChange={e => setTwitterKey(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Twitter API Secret Key"
            value={twitterSecret}
            onChange={e => setTwitterSecret(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Twitter Access Token"
            value={twitterToken}
            onChange={e => setTwitterToken(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Twitter Access Token Secret"
            value={twitterTokenSecret}
            onChange={e => setTwitterTokenSecret(e.target.value)}
            autoComplete="off"
          />
          <div style={{fontSize:'0.95em',color:'#888',marginTop:'0.5em'}}>Keys are never stored; used only in your browser.</div>
        </div>
      </div>
      <div className="section">
        <div className="section-header">Generate a Tweet</div>
        <div className="gray-box">
          <input
            type="text"
            placeholder="Enter a tweet topic..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            disabled={genLoading}
          />
          <button onClick={generateTweet} disabled={genLoading || !topic || !openaiKey}>
            {genLoading ? 'Generating...' : 'Generate Tweet'}
          </button>
        </div>
        {tweet && (
          <div className="tweet-box">{tweet}</div>
        )}
        {tweet && (
          <button onClick={postTweet} disabled={posting} style={{marginBottom:24}}>
            {posting ? 'Posting...' : 'Post to Twitter'}
          </button>
        )}
        {status && <div className="status">{status}</div>}
        {error && <div className="error">{error}</div>}
      </div>
      <div className="section">
        <div className="section-header">Project Showcase</div>
        <div className="gray-box">
          <div style={{color:'#bbb'}}>This minimalist TweetBot lets you generate and (simulated) post tweets using OpenAI and Twitter APIs. Built with Next.js, statically deployable to Vercel.</div>
        </div>
      </div>
    </div>
  );
}
