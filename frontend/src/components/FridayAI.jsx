import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function FridayAI({ onCommand, isOpen, setIsOpen }) {
  const [state, setState] = useState('idle');
  const [history, setHistory] = useState([]);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const audioRef = useRef(null);
  // Tracks whether the first-open greeting has been spoken already
  const greetedRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  // Stop any currently playing audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => { stopAudio(); };
  }, [stopAudio]);

  const speak = useCallback(async (text) => {
    if (!text) return;
    stopAudio();
    setState('speaking');
    try {
      const res = await api.post('/friday/speak', { text });
      const audioUrl = res.data?.audioUrl;
      if (!audioUrl) {
        // ElevenLabs not configured or returned no audio — stay silent, just reset state
        setState('idle');
        return;
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { audioRef.current = null; setState('idle'); };
      audio.onerror = () => { audioRef.current = null; setState('idle'); };
      audio.play().catch(() => { audioRef.current = null; setState('idle'); });
    } catch {
      // Network or backend error — fail silently, text is already in chat
      setState('idle');
    }
  }, [stopAudio]);

  const executeCommand = useCallback(async (text) => {
    setState('processing');
    const lower = text.toLowerCase();
    
    setHistory(prev => [...prev, { role: 'user', content: text }]);

    if (onCommand) {
      if (lower.includes('map') || lower.includes('vietnam')) onCommand('map');
      else if (lower.includes('co2') || lower.includes('carbon') || lower.includes('emission')) onCommand('co2');
      else if (lower.includes('report')) onCommand('report');
      else if (lower.includes('citizen')) onCommand('citizens');
      else if (lower.includes('dashboard') || lower.includes('overview')) onCommand('overview');
      else if (lower.includes('hanoi') || lower.includes('ho chi minh') || lower.includes('da nang')) onCommand('map');
    }
    
    let fullReply = '';
    try {
      const res = await api.post('/friday/chat', { message: text, history: history.slice(-10) });
      fullReply = res.data.reply || res.data.message || 'Analysis complete.';
    } catch {
      fullReply = 'FRIDAY backend is not reachable, so I cannot create a genuine live-data answer right now. Please start the backend on port 5000 and ask again. I will not show hardcoded city recommendations.';
    }
    
    setHistory(prev => [...prev, { role: 'assistant', content: fullReply }]);
    speak(fullReply);
  }, [onCommand, speak]);

  const startListening = useCallback(() => {
    if (state === 'speaking') { stopAudio(); setState('idle'); return; }
    if (state === 'listening') { recognitionRef.current?.abort(); setState('idle'); return; }
    if (state === 'processing') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { 
      const r = 'Speech recognition not supported. Please use Chrome or Edge.'; 
      setHistory(prev => [...prev, { role: 'assistant', content: r }]);
      speak(r); 
      return; 
    }
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
    rec.onstart = () => setState('listening');
    rec.onresult = (e) => { const t = e.results[0][0].transcript; executeCommand(t); };
    rec.onerror = () => { setState('idle'); };
    rec.onend = () => { if (state === 'listening') setState('idle'); };
    rec.start();
    recognitionRef.current = rec;
  }, [state, executeCommand, speak, stopAudio]);

  // Seed greeting text into chat history on mount (no audio — avoids autoplay restriction).
  // Audio greeting fires on the first explicit user click (see collapsed button onClick below).
  useEffect(() => {
    const g = 'FRIDAY online. Environmental monitoring active across all Vietnamese city nodes. Awaiting command.';
    setHistory([{ role: 'assistant', content: g }]);
  }, []);

  const colors = {
    idle: { main: '#00ff88', glow: '#00ff8888', bg: 'linear-gradient(135deg,#00ff88,#00c853)', label: 'TAP TO SPEAK' },
    listening: { main: '#00e5ff', glow: '#00e5ff88', bg: 'linear-gradient(135deg,#00e5ff,#0091ea)', label: '🎤 LISTENING...' },
    processing: { main: '#ff9800', glow: '#ff980088', bg: 'linear-gradient(135deg,#ff9800,#e65100)', label: '⚡ PROCESSING...' },
    speaking: { main: '#b388ff', glow: '#b388ff88', bg: 'linear-gradient(135deg,#7c4dff,#651fff)', label: '🔊 SPEAKING...' },
  };
  const c = colors[state];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 select-none">
        <button
          onClick={() => {
            setIsOpen(true);
            // First real user interaction — browser autoplay policy now allows audio.
            // Speak the greeting once and mark as greeted to prevent replays.
            if (!greetedRef.current) {
              greetedRef.current = true;
              const g = 'FRIDAY online. Environmental monitoring active across all Vietnamese city nodes. Awaiting command.';
              speak(g);
            }
          }}
          className="relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          style={{background:c.bg,boxShadow:`0 0 20px ${c.glow},0 0 40px ${c.glow}55`,border:`2px solid ${c.main}55`}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10c0-2-.57-3.86-1.56-5.44C18.7 3.94 15.47 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="#030d07"/><path d="M9 9v6h2l3 3V6L11 9H9z" fill="#030d07"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[25%] min-w-[300px] z-50 flex flex-col select-none border-l shadow-2xl transition-transform duration-300 transform translate-x-0"
         style={{background:'#020b05', borderColor:'#00ff8833', boxShadow:'-10px 0 30px #00ff8811'}}>
      
      <div className="p-4 border-b flex items-center justify-between" style={{borderColor:'#00ff8833', background:'#04150a'}}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{background:c.main,animation:'pulse 1.5s infinite'}}/>
          <span style={{color:c.main,fontFamily:'monospace',fontSize:'12px',fontWeight:'bold',letterSpacing:'0.1em'}}>FRIDAY AI</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[#81c784] hover:text-[#00ff88] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
        {history.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-2xl text-xs font-mono leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
              style={{
                background: msg.role === 'user' ? '#0a1f0e' : '#061209',
                border: `1px solid ${msg.role === 'user' ? '#00ff8822' : c.main+'44'}`,
                color: msg.role === 'user' ? '#81c784' : '#c8f7d0',
                boxShadow: msg.role === 'assistant' ? `0 0 20px ${c.glow}22` : 'none'
              }}>
              {msg.content}
            </div>
          </div>
        ))}
        {state === 'processing' && (
          <div className="flex flex-col items-start">
             <div className="max-w-[90%] p-3 rounded-2xl rounded-tl-none text-xs font-mono" style={{background:'#061209',border:`1px solid ${c.main}44`,color:'#c8f7d0'}}>
               <span className="animate-pulse">Analyzing data...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t flex flex-col items-center gap-3" style={{borderColor:'#00ff8833', background:'#04150a'}}>
        <div className="relative flex items-center justify-center">
          {state === 'listening' && [0,1,2].map(i => (
            <div key={i} className="absolute rounded-full pointer-events-none"
              style={{width:`${80+i*20}px`,height:`${80+i*20}px`,border:`2px solid ${c.glow}`,animation:`ping ${1+i*0.3}s ease-out infinite`,animationDelay:`${i*0.25}s`}}/>
          ))}
          <button onClick={startListening}
            className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{background:c.bg,boxShadow:`0 0 20px ${c.glow},0 0 40px ${c.glow}55`,border:`2px solid ${c.main}55`}}>
            {state==='idle' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10c0-2-.57-3.86-1.56-5.44C18.7 3.94 15.47 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="#030d07"/><path d="M9 9v6h2l3 3V6L11 9H9z" fill="#030d07"/></svg>}
            {state==='listening' && (
              <div className="flex items-end gap-0.5 h-6">
                {[3,6,9,6,3].map((h,i)=>(
                  <div key={i} className="w-1 rounded-full" style={{height:`${h+Math.sin(Date.now()/200+i)*3}px`,background:'#030d07',animation:`waveBar 0.6s ease-in-out infinite`,animationDelay:`${i*0.1}s`}}/>
                ))}
              </div>
            )}
            {state==='processing' && (
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{border:'2px solid #030d0755',borderTopColor:'#030d07'}}/>
            )}
            {state==='speaking' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#030d07"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#030d07" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#030d07" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-mono font-bold"
          style={{color:c.main,background:`${c.main}11`,border:`1px solid ${c.main}33`,fontSize:'10px',letterSpacing:'0.1em'}}>
          {c.label}
        </div>
        <div style={{color:'#2e7d32',fontSize:'9px',fontFamily:'monospace',textAlign:'center',lineHeight:'1.6'}}>
          "Friday open map" • "Analyze Hanoi"<br/>"Show CO2 alert" • "Generate report"
        </div>
      </div>
    </div>
  );
}

