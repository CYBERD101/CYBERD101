import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, ShieldAlert, Cpu, Ghost, Volume2, VolumeX, Activity, Lock, AlertTriangle } from 'lucide-react';

const MatrixBackground = React.memo(({ color }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 2, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, [color]);

  return <canvas ref={canvasRef} className="matrix-bg" />;
});

const MouseFollower = React.memo(({ color }) => {
  const followerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (followerRef.current) {
        // Direct DOM manipulation with translate3d for hardware acceleration
        // and to bypass React's reconciliation for high-frequency updates
        followerRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={followerRef}
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border opacity-50"
      style={{
        left: 0,
        top: 0,
        borderColor: color,
        boxShadow: `0 0 10px ${color}`
      }}
    />
  );
});

const HackerAvatar = React.memo(({ status }) => {
  const getStatusIcon = () => {
    switch(status) {
      case 'processing': return <Activity className="animate-spin" size={16} />;
      case 'alert': return <AlertTriangle className="animate-bounce" size={16} />;
      default: return <ShieldAlert size={16} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative group">
        <div className={`w-28 h-28 bg-hacker-dark border-2 rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-500 ${
          status === 'processing' ? 'border-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
          status === 'alert' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
          'border-hacker-green shadow-[0_0_20px_rgba(0,255,65,0.3)]'
        }`}>
          <img
            src="/ai_avatar.jpg"
            alt="AI Avatar"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <Ghost size={60} className="text-hacker-green hidden" />
        </div>
        <div className={`absolute -bottom-2 -right-2 bg-hacker-dark border p-1 transition-colors duration-500 ${
          status === 'processing' ? 'border-yellow-500 text-yellow-500' :
          status === 'alert' ? 'border-red-500 text-red-500' :
          'border-hacker-green text-hacker-green'
        }`}>
          {getStatusIcon()}
        </div>
      </div>
      <p className={`mt-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${
        status === 'processing' ? 'text-yellow-500' :
        status === 'alert' ? 'text-red-500' :
        'text-hacker-green'
      }`}>Cyber-Assist AI</p>
    </div>
  );
});

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM INITIALIZED. PROTOCOLS ACTIVE. WAITING FOR COMMAND...' }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, processing, alert
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const scrollRef = useRef(null);

  const themeColor = status === 'processing' ? '#f59e0b' : status === 'alert' ? '#ef4444' : '#00FF41';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStatus('processing');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              const content = data.choices[0].delta.content || '';
              assistantMessage.content += content;

              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...assistantMessage };
                return newMessages;
              });
            } catch (err) {
              console.error('Parse Error', err);
            }
          }
        }
      }
      speak(assistantMessage.content);
      setStatus('idle');
    } catch (error) {
      console.error('Fetch Error', error);
      setStatus('alert');
      setMessages(prev => [...prev, { role: 'assistant', content: 'CRITICAL ERROR: UPLINK LOST. RE-ESTABLISHING SECURE TUNNEL...' }]);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000" style={{ backgroundColor: '#0D0208' }}>
      <MatrixBackground color={themeColor} />
      <MouseFollower color={themeColor} />
      <div className="scanline" style={{ boxShadow: `0 0 10px ${themeColor}`, background: `${themeColor}1A` }} />
      <div className="crt-overlay" />

      {/* Main Terminal UI */}
      <div className="w-full max-w-5xl h-[85vh] bg-hacker-dark/95 rounded-lg flex flex-col z-10 overflow-hidden transition-all duration-500"
           style={{ border: `1px solid ${themeColor}`, boxShadow: `0 0 30px ${themeColor}33` }}>

        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center bg-hacker-dim/20" style={{ borderColor: `${themeColor}4D` }}>
          <div className="flex items-center gap-3">
            <Terminal size={18} className="animate-pulse" style={{ color: themeColor }} />
            <span className="font-bold text-xs tracking-widest uppercase opacity-80" style={{ color: themeColor, textShadow: `0 0 5px ${themeColor}` }}>
              SECURE_SHELL_v1.0.4 - ATTACHED
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-1 border rounded text-[10px]" style={{ borderColor: `${themeColor}4D`, color: themeColor }}>
              <Lock size={10} /> ENCRYPTED
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="hover:scale-110 transition-transform"
              style={{ color: themeColor }}
            >
              {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r hidden md:flex flex-col bg-black/40" style={{ borderColor: `${themeColor}33` }}>
             <HackerAvatar status={status} />
             <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] opacity-50 uppercase">Network</span>
                    <span className="text-[9px] font-bold" style={{ color: themeColor }}>CONNECTED</span>
                  </div>
                  <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                    <div className="h-full animate-pulse" style={{ width: '85%', backgroundColor: themeColor }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] opacity-50 uppercase">CPU Usage</span>
                    <span className="text-[9px] font-bold" style={{ color: themeColor }}>14.2%</span>
                  </div>
                  <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: '14.2%', backgroundColor: themeColor }} />
                  </div>
                </div>
                <div className="pt-6 border-t flex flex-col items-center gap-3" style={{ borderColor: `${themeColor}1A` }}>
                  <Cpu className="animate-spin-slow" size={28} style={{ color: themeColor }} />
                  <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase">Neural Engine Active</span>
                </div>
             </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide mb-6"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 border transition-all duration-500 ${
                    msg.role === 'user'
                      ? 'bg-white/5 border-white/20 ml-12 rounded-lg'
                      : 'bg-black/60 mr-12 rounded-lg shadow-inner'
                  }`} style={{ borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : `${themeColor}33` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: msg.role === 'user' ? '#FFF' : themeColor }}>
                        {msg.role === 'user' ? '> GUEST' : '> CYBER_ASSIST'}
                      </span>
                      <div className="h-[1px] flex-1 opacity-10" style={{ backgroundColor: msg.role === 'user' ? '#FFF' : themeColor }} />
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono tracking-tight"
                       style={{ color: msg.role === 'user' ? '#EEE' : themeColor }}>
                      {msg.content}
                      {idx === messages.length - 1 && status === 'processing' && (
                        <span className="inline-block w-2 h-4 animate-pulse ml-1 align-middle" style={{ backgroundColor: themeColor }} />
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 blur-md opacity-20 transition-opacity group-focus-within:opacity-40" style={{ backgroundColor: themeColor }} />
              <div className="relative flex items-center bg-black/80 border transition-all"
                   style={{ borderColor: `${themeColor}66` }}>
                <span className="pl-4 text-xs font-bold" style={{ color: themeColor }}>$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="EXECUTE COMMAND..."
                  className="flex-1 bg-transparent border-none p-4 text-sm focus:outline-none placeholder:text-white/10"
                  style={{ color: themeColor }}
                />
                <button
                  type="submit"
                  className="p-4 transition-all hover:scale-110 active:scale-95"
                  style={{ color: themeColor }}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 px-6 border-t text-[9px] flex justify-between bg-black/60 font-bold tracking-widest"
             style={{ borderColor: `${themeColor}1A`, color: themeColor }}>
          <div className="flex gap-6 uppercase">
            <span className="flex items-center gap-1"><Activity size={10} /> LATENCY: 2ms</span>
            <span className="flex items-center gap-1"><Cpu size={10} /> MEMORY: 4.8GB</span>
          </div>
          <div className="uppercase opacity-50">
            LOCAL_AI_NODE_01 // SECURE_MODE_ENABLED
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
