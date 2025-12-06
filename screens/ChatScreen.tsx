import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { marked } from 'marked';
import { Button, NovaMascot } from '../components/ui';
import { ChatMessage } from '../types';
import { sendMessageToNova } from '../services/geminiService';

interface ChatScreenProps {
  onBack: () => void;
  targetLanguage: string;
}

// Quick prompts to help users get started
const QUICK_PROMPTS = [
  { text: "Teach me a greeting", icon: "👋" },
  { text: "How do I order coffee?", icon: "☕" },
  { text: "Explain grammar basics", icon: "📚" },
  { text: "Quiz me on animals", icon: "🦊" }
];

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, targetLanguage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: `Selam! I'm **Nova**. 👋 \n\nI'm here to help you practice **${targetLanguage}**.\n\nAsk me anything or try a quick topic below! 🦊` 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const reply = await sendMessageToNova([...messages, userMsg], text, targetLanguage);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: reply
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  // Render Markdown safely
  const renderMarkdown = (text: string) => {
    const html = marked.parse(text);
    return { __html: html };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white p-3 sm:p-4 shadow-sm border-b border-gray-200 flex items-center gap-4 z-20">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-nova-primary rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
             <div className="scale-75 translate-y-1">
               <NovaMascot size="sm" />
             </div>
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg leading-tight">Nova Tutor</h1>
            <div className="flex items-center gap-1">
              <span className="text-xs text-nova-primary font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                AI Powered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* Model Avatar (Left) */}
            {msg.role === 'model' && (
               <div className="mr-3 mt-auto shrink-0">
                 <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
                    <div className="scale-50 translate-y-1">
                      <NovaMascot size="sm" emotion="talking" />
                    </div>
                 </div>
               </div>
            )}

            {/* Bubble */}
            <div className={`
              max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm sm:text-base shadow-sm relative
              ${msg.role === 'user' 
                ? 'bg-nova-primary text-white rounded-br-none shadow-blue-500/20' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-gray-200/50'}
            `}>
              {msg.role === 'user' ? (
                // User text is usually plain, but we can preserve newlines
                <div className="whitespace-pre-wrap">{msg.text}</div>
              ) : (
                // Model text is Markdown formatted
                <div 
                  className="prose prose-sm max-w-none text-gray-800 [&>strong]:text-nova-primary [&>strong]:font-black"
                  dangerouslySetInnerHTML={renderMarkdown(msg.text)} 
                />
              )}
            </div>

          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start w-full">
             <div className="mr-3 mt-auto shrink-0">
               <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <div className="scale-50 translate-y-1">
                    <NovaMascot size="sm" emotion="talking" />
                  </div>
               </div>
             </div>
             <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-nova-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-nova-primary rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-nova-primary rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-2 sm:p-4 pb-6 sm:pb-4 z-20">
        
        {/* Quick Suggestions (Only show if chat is short) */}
        {messages.length < 4 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 px-2 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.text)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-full text-xs font-bold text-gray-600 hover:text-nova-primary transition-colors flex items-center gap-1.5"
              >
                <span>{prompt.icon}</span>
                {prompt.text}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 max-w-3xl mx-auto items-end">
          <Button variant="outline" className="px-3 h-[50px] rounded-xl hidden sm:flex items-center justify-center border-2 border-gray-200 text-gray-400 hover:text-nova-primary hover:border-nova-primary transition-all" title="Voice Input (Coming Soon)">
             <Mic size={22} />
          </Button>
          
          <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:bg-white focus-within:border-nova-primary focus-within:ring-4 focus-within:ring-blue-500/10 transition-all flex items-center px-4 py-2">
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 py-1"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
          </div>

          <Button 
            variant="primary" 
            className={`h-[50px] w-[50px] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all ${(!inputText.trim() || isLoading) ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95'}`}
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={22} className={isLoading ? 'opacity-0' : 'opacity-100'} />
            {isLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
          </Button>
        </div>
      </div>
    </div>
  );
};