# ElevenLabs FRIDAY Voice Setup

This upgraded zip now supports ElevenLabs voice output for FRIDAY.

## 1. ElevenLabs API key permissions

While creating the API key in ElevenLabs, enable:

- Text to Speech → Access
- Voices → Read
- Models → Access

If custom permissions are not visible, use Full Access.

## 2. Add values in backend `.env`

Copy `backend/.env.example` to `backend/.env`, then add:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_STABILITY=0.45
ELEVENLABS_SIMILARITY_BOOST=0.85
ELEVENLABS_STYLE=0.35
```

## 3. Voice priority

FRIDAY now speaks using this order:

1. ElevenLabs voice
2. Chatterbox local TTS fallback
3. Browser Web Speech fallback

## 4. Test status

Start backend and open:

```txt
http://localhost:5000/api/health
```

After login, this also works:

```txt
http://localhost:5000/api/ai/api-key-status
```

## 5. Important

Do not put ElevenLabs API key inside frontend files. Keep it only in `backend/.env`.
