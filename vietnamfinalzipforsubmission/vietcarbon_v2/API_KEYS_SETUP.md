# VietCarbon AI — API Key Setup

Use this file when `.env` is missing or FRIDAY says an API is not configured.

## 1) Groq API Key — AI Brain
- Website: https://console.groq.com
- Go to Groq Console → API Keys → Create API Key
- Put in `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## 2) MongoDB Atlas URI — Database
- Website: https://cloud.mongodb.com
- Go to Database → Connect → Drivers → Copy connection string
- Replace username/password in the URI
- Network Access must allow your IP. For testing you can use `0.0.0.0/0`.

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vietcarbon_ai?retryWrites=true&w=majority
```

## 3) AssemblyAI API Key — Voice Listening
- Website: https://www.assemblyai.com
- Go to Dashboard → API Keys → Copy key

```env
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

Note: The current included FRIDAY uses browser speech recognition for quick demo. AssemblyAI key is added for the advanced streaming voice pipeline.

## 4) Chatterbox TTS — Free Female AI Voice
Chatterbox is open-source. You do not need a paid ElevenLabs key.

Run a local Chatterbox TTS server, then put the local URL:

```env
CHATTERBOX_TTS_URL=http://localhost:8000
CHATTERBOX_VOICE=female
CHATTERBOX_EXAGGERATION=0.65
CHATTERBOX_CFG_WEIGHT=0.5
```

If this is not running, FRIDAY automatically uses browser female voice fallback.

## 5) Gmail App Password — Email Sending
- Google Account → Security → 2-Step Verification → App Passwords
- Create app password for Mail

```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_digit_app_password
```

## 6) Check API Status
After login, backend has a safe status route:

```txt
GET http://localhost:5000/api/api-key-status
```

It only says `configured` or `missing`. It never exposes secret keys.

---

## ElevenLabs FRIDAY Voice Option Added

This upgraded version includes ElevenLabs support for FRIDAY voice.

Add in `backend/.env`:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_STABILITY=0.45
ELEVENLABS_SIMILARITY_BOOST=0.85
ELEVENLABS_STYLE=0.35
```

API key permissions needed:

```txt
Text to Speech → Access
Voices → Read
Models → Access
```

FRIDAY voice priority:

```txt
ElevenLabs → Chatterbox fallback → Browser fallback
```
