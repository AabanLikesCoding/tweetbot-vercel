# TweetBot Vercel

A minimalist, dark-themed TweetBot web app. Generates tweets using OpenAI and posts to Twitter using user-supplied API keys. Fully static and deployable to Vercel.

## Features
- Dark theme, minimalist UI
- User pastes OpenAI and Twitter API keys (not stored)
- Generate and post tweets from the browser
- Vercel-ready static export

## Usage
1. Deploy to Vercel or run locally with `npm run dev`.
2. Paste your API keys in the UI.
3. Enter a topic, generate a tweet, and post to Twitter.

## Deploying to Vercel
- Push this repo to GitHub and connect to Vercel.
- Set build command: `npm run build && npm run export`
- Set output directory: `out`

## Security
API keys are never stored or transmitted except directly to the APIs. Use with caution.
