import streamlit as st
import openai
import tweepy

st.set_page_config(page_title="TweetBot", page_icon="🐦", layout="centered", initial_sidebar_state="collapsed")

st.markdown("""
    <style>
    body { background: #111 !important; }
    .main { background: #111 !important; }
    .stApp { background: #111 !important; }
    .profile-pic {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #222;
        margin-bottom: 2rem;
    }
    .gray-box {
        background: #232323;
        border-radius: 16px;
        padding: 1.2rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .section-header {
        font-size: 1.2rem;
        color: #b0b0b0;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
        font-weight: 700;
    }
    .tweet-box {
        font-size: 1.1rem;
        color: #fff;
        background: #181818;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        min-height: 60px;
        border: 1px solid #232323;
    }
    </style>
""", unsafe_allow_html=True)

st.markdown("<div style='height:32px'></div>", unsafe_allow_html=True)

profile_img = 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'  # Placeholder, replace with your own
st.markdown(f'<img src="{profile_img}" class="profile-pic" />', unsafe_allow_html=True)

st.markdown("<h1 style='text-align:center; color:white;'>TweetBot</h1>", unsafe_allow_html=True)

with st.expander("API Keys", expanded=True):
    gemini_key = st.text_input("Gemini API Key", type="password")
    tw_key = st.text_input("Twitter API Key", type="password")
    tw_secret = st.text_input("Twitter API Secret Key", type="password")
    tw_token = st.text_input("Twitter Access Token", type="password")
    tw_token_secret = st.text_input("Twitter Access Token Secret", type="password")

st.markdown('<div class="section-header">Generate a Tweet</div>', unsafe_allow_html=True)
with st.form("tweet_form", clear_on_submit=False):
    topic = st.text_input("Topic", key="topic")
    gen = st.form_submit_button("Generate Tweet")
    tweet = ""
    if gen and gemini_key and topic:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            models = genai.list_models()
            model_names = [model.name for model in models]
            st.write("Available Gemini models:")
            st.write(model_names)
            model = genai.GenerativeModel('gemini-1.0-pro-latest')
            prompt = f"make a tweet about {topic}. keep it short n like a human made it. tweet like a funny real twitter user."
            resp = model.generate_content(prompt)
            tweet = resp.text.strip()
            st.session_state['tweet'] = tweet
        except Exception as e:
            st.error(f"Gemini error: {e}")
    elif 'tweet' in st.session_state:
        tweet = st.session_state['tweet']

if tweet:
    st.markdown('<div class="tweet-box">' + tweet + '</div>', unsafe_allow_html=True)
    post = st.button("Post to Twitter")
    if post and tw_key and tw_secret and tw_token and tw_token_secret:
        try:
            auth = tweepy.OAuth1UserHandler(tw_key, tw_secret, tw_token, tw_token_secret)
            api = tweepy.API(auth)
            api.update_status(tweet)
            st.success("Tweet posted!")
        except Exception as e:
            st.error(f"Twitter error: {e}")

st.markdown('<div class="section-header">Project Showcase</div>', unsafe_allow_html=True)
st.markdown('<div class="gray-box" style="color:#bbb;">This is a bot made w/ streamlit python and twitter/openai api</div>', unsafe_allow_html=True)
