import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
} 

const AiAssistant = () => {
  const { user } = useAppContext() as any;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.trim().split(' ')[0];

  // Initial welcome message when chat is opened
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Hey ${firstName}! 👋 I am your cute AI Health Assistant. How can I help you today ? ✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [firstName]);

  // Scroll chat history to the bottom softly
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulated API response delay for backend integration later
    // setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-[#f4f9ff] dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 p-4 md:p-6 rounded-[2.5rem] border-4 border-[#e0f0ff] dark:border-[#1e293b] shadow-xl overflow-hidden transition-colors duration-300">
      
      {/* Cute Chat Header Section */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#e0f0ff] dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center shadow-md w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-400 to-cyan-300 dark:from-blue-600 dark:to-cyan-400 animate-pulse">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400">AI Companion</h2>
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </span>
            </div>
            <p className="text-xs text-blue-500/80 dark:text-slate-400">AI can make mistakes! 🌟</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-[#e0f0ff]/70 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 px-3 py-1.5 rounded-2xl text-xs font-bold text-blue-600 dark:text-blue-300 shadow-xs">
          <Sparkles size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
          <span>Health monitor</span>
        </div>
      </div>

      {/* Chat Message Window */}
      <div className="flex-1 py-6 pr-2 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Soft Curvy Avatar */}
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform duration-200 hover:scale-110 ${
              msg.sender === 'user' 
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/50 text-blue-500' 
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {msg.sender === 'user' ? <UserIcon size={18} /> : <Bot size={18} className="fill-current text-amber-400 dark:text-cyan-400 stroke-slate-600 dark:stroke-slate-800" />}
            </div>

            {/* Cloud Message Bubble */}
            <div className="space-y-1">
              <div className={`p-4 rounded-[2rem] text-sm leading-relaxed shadow-xs transition-all duration-300 ${
                msg.sender === 'user'
                  ? 'bg-linear-to-br from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-500 text-white rounded-tr-none border-b-2 border-blue-500/20'
                  : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200 border-2 border-[#e0f0ff] dark:border-[#334155] rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <p className={`text-[10px] font-semibold text-blue-400 dark:text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Adorable Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[70%] mr-auto">
            <div className="flex items-center justify-center border-2 shrink-0 text-slate-500 bg-slate-50 border-slate-200 w-9 h-9 rounded-2xl dark:bg-slate-800/60 dark:border-slate-700">
              <Bot size={18} />
            </div>
            <div className="bg-white dark:bg-[#1e293b] border-2 border-[#e0f0ff] dark:border-[#334155] p-4 rounded-[2rem] rounded-tl-none flex items-center gap-2 px-5 shadow-xs">
              <span className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2.5 h-2.5 bg-cyan-400 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2.5 h-2.5 bg-blue-300 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Cloud Bottom Input Bar */}
      <form onSubmit={handleSend} className="pt-4 mt-4 border-t-2 border-dashed border-[#e0f0ff] dark:border-[#334155]">
        <div className="relative flex items-center bg-white dark:bg-[#1e293b] border-2 border-[#e0f0ff] dark:border-[#334155] rounded-[1.5rem] focus-within:border-blue-400/70 dark:focus-within:border-blue-500/70 focus-within:ring-2 focus-within:ring-blue-300/20 dark:focus-within:ring-blue-500/20 transition-all px-4 py-2.5 shadow-xs">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your assistant..."
            className="w-full py-1.5 pr-12 text-sm text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder-blue-300 dark:placeholder-slate-500 font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-2 p-2.5 rounded-2xl transition-all ${
              input.trim() 
                ? 'bg-linear-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-500 text-white hover:opacity-90 active:scale-90 shadow-md shadow-blue-400/20' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            <Send size={15} className="fill-current stroke-2" />
          </button>
        </div>
      </form>

    </div>
  );
};

export default AiAssistant;
