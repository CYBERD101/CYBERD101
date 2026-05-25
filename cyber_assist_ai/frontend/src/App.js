import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, ShieldAlert, Cpu, Volume2, VolumeX } from 'lucide-react';

const MatrixBackground = ({ color = '#00FF41' }) => {
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
};

const MouseFollower = ({ color = '#00FF41' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border opacity-50 transition-transform duration-75"
      style={{
        left: position.x - 16,
        top: position.y - 16,
        boxShadow: `0 0 10px ${color}`,
        borderColor: color
      }}
    />
  );
};

const HackerAvatar = ({ color }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="relative">
      <div className="w-28 h-28 bg-hacker-dark border-2 rounded-full flex items-center justify-center overflow-hidden animate-pulse-slow" style={{ borderColor: color }}>
         {/* Representing the winged skull with SVG */}
         <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1 4.5 3 6v2c0 1 1 2 2 2h2c1 0 2-1 2-2v-2c2-1.5 3-3.5 3-6 0-3.5-2.5-6-6-6z" />
            <path d="M9 10h1" /><path d="M14 10h1" /><path d="M10 14h4" />
            <path d="M6 8c-3 0-5 2-5 5s2 5 5 5h1" /><path d="M18 8c3 0 5 2 5 5s-2 5-5 5h-1" />
            <path d="M12 18v3" /><path d="M10 21h4" />
         </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-hacker-dark border p-1" style={{ borderColor: color }}>
        <ShieldAlert size={16} style={{ color: color }} />
      </div>
    </div>
    <p className="mt-2 text-xs font-bold tracking-widest uppercase glow-text" style={{ color: color, textShadow: `0 0 5px ${color}` }}>Cyber-Assist AI</p>
  </div>
);

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM READY. STANDING BY FOR COMMANDS...' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [systemState, setSystemState] = useState('idle'); // idle, processing, alert
  const scrollRef = useRef(null);

  const getThemeColor = () => {
    switch (systemState) {
      case 'processing': return '#00d4ff'; // Cyber Blue
      case 'alert': return '#ff003c'; // Warning Red
      default: return '#00FF41'; // Hacker Green
    }
  };

  const getThemeBorder = () => {
    switch (systemState) {
      case 'processing': return 'border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]';
      case 'alert': return 'border-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.3)]';
      default: return 'border-hacker-green shadow-[0_0_15px_rgba(0,255,65,0.2)]';
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setSystemState('processing');

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
              console.error('Error parsing chunk', err);
            }
          }
        }
      }
      speak(assistantMessage.content);
      setSystemState('idle');
    } catch (error) {
      console.error('Error fetching chat:', error);
      setSystemState('alert');
      setMessages(prev => [...prev, { role: 'assistant', content: 'CONNECTION ERROR: SYSTEM OFFLINE.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ color: getThemeColor() }}>
      <MatrixBackground color={getThemeColor()} />
      <MouseFollower color={getThemeColor()} />
      <div className="scanline" />
      <div className="crt-overlay" />

      {/* Main Terminal UI */}
      <div className={`w-full max-w-4xl h-[80vh] bg-hacker-dark/90 border rounded-lg flex flex-col z-10 overflow-hidden transition-colors duration-500 ${getThemeBorder()}`}>
        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center bg-hacker-dim/30" style={{ borderColor: getThemeColor() }}>
          <div className="flex items-center gap-2">
            <Terminal size={20} className="animate-pulse" />
            <span className="font-bold tracking-tighter glow-text" style={{ textShadow: `0 0 5px ${getThemeColor()}` }}>TERMINAL@CYBER_ASSIST: ~</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="hover:scale-110 transition-transform"
            >
              {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r hidden md:flex flex-col bg-hacker-dark/50" style={{ borderColor: `${getThemeColor()}44` }}>
             <HackerAvatar color={getThemeColor()} />
             <div className="p-4 space-y-4">
                <div className="text-[10px] space-y-1">
                  <p className="opacity-60 uppercase">SYSTEM STATUS: <span style={{ color: getThemeColor() }}>{systemState.toUpperCase()}</span></p>
                  <p className="opacity-60 uppercase">ENCRYPTION: <span style={{ color: getThemeColor() }}>AES-256</span></p>
                  <p className="opacity-60 uppercase">LOCAL AI: <span style={{ color: getThemeColor() }}>ACTIVE</span></p>
                </div>
                <div className="pt-4 flex justify-center">
                  <Cpu className="animate-spin-slow" size={32} style={{ color: getThemeColor() }} />
                </div>
             </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide mb-4"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 border ${
                    msg.role === 'user'
                      ? 'bg-hacker-green/10 border-hacker-green ml-12 rounded-tl-lg rounded-bl-lg rounded-tr-lg'
                      : 'bg-hacker-dark border-hacker-green/50 mr-12 rounded-tr-lg rounded-br-lg rounded-tl-lg'
                  }`} style={{ borderColor: msg.role === 'user' ? '#00FF41' : `${getThemeColor()}88` }}>
                    <p className="text-xs opacity-50 mb-1 uppercase font-bold">
                      {msg.role === 'user' ? 'Authorized User' : 'Cyber-Assist'}
                    </p>
                    <p className="text-sm break-words leading-relaxed">
                      {msg.content}
                      {idx === messages.length - 1 && isTyping && <span className="inline-block w-2 h-4 animate-pulse ml-1" style={{ backgroundColor: getThemeColor() }} />}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ENTER COMMAND OR QUERY..."
                className="w-full bg-hacker-dark border p-3 pl-4 pr-12 focus:outline-none transition-all placeholder:opacity-30"
                style={{ borderColor: getThemeColor(), boxShadow: `inset 0 0 5px ${getThemeColor()}22` }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform"
                style={{ color: getThemeColor() }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-1 px-4 border-t text-[10px] flex justify-between bg-hacker-dark" style={{ borderColor: `${getThemeColor()}44` }}>
          <p className="animate-pulse">CONNECTED TO LOCALHOST:8000</p>
          <p>CPU LOAD: 12% | RAM: 4.2GB / 16GB</p>
        </div>
      </div>
    </div>
  );
}

export default App;
