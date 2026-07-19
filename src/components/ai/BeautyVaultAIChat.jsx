'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { useSession } from '@/lib/auth-client';
import { useStore } from '@/providers/StoreProvider';

const SUGGESTED_PROMPTS = [
  "Best foundation for oily skin",
  "Build my skincare routine",
  "Trending products",
  "Vegan products",
  "Cruelty-free makeup"
];

export default function BeautyVaultAIChat() {
  const { data: session } = useSession();
  const { cart, wishlist, showToast } = useStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage initially
  useEffect(() => {
    const saved = localStorage.getItem('bv_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Save to localStorage and scroll to bottom
  useEffect(() => {
    localStorage.setItem('bv_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          cart: cart,
          wishlist: wishlist
        })
      });

      if (!res.ok) throw new Error('API Error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          updated[updated.length - 1] = { ...lastMsg, content: lastMsg.content + chunk };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble answering right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    showToast('Conversation cleared', 'success');
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-[#E91E63] to-[#C2185B] rounded-full text-white shadow-[0_8px_30px_rgb(233,30,99,0.3)] flex items-center justify-center z-50 hover:shadow-[0_8px_30px_rgb(233,30,99,0.5)] transition-shadow"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-[#FFF9FB] rounded-3xl shadow-2xl flex flex-col z-50 border border-[#F8BBD0]/50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">BeautyVault AI</h3>
                  <p className="text-[10px] text-pink-100 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={clearChat} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Clear Chat">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/50 to-transparent">
              {messages.length === 0 ? (
                <div className="flex flex-col h-full items-center justify-center text-center px-4 space-y-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <Sparkles className="w-8 h-8 text-[#E91E63]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-gray-800">Hi! 👋 I'm BeautyVault AI.</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      I can help you find the perfect products, build a routine, compare items, and answer beauty questions.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center w-full mt-4">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="bg-white border border-[#F8BBD0] text-[#E91E63] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-pink-50 transition-colors shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} content={msg.content} onFollowUpClick={handleSend} />
                  ))}
                  {isLoading && (
                    <div className="flex w-full mb-4 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#C2185B] flex items-center justify-center text-white shrink-0 mr-3 shadow-md">
                        <MessageCircle className="w-4.5 h-4.5" />
                      </div>
                      <div className="bg-white border border-[#F8BBD0]/40 text-gray-700 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#E91E63] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#E91E63] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#E91E63] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#F8BBD0]/30 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about makeup, skincare, etc..."
                  className="w-full bg-[#FFF9FB] border border-[#F8BBD0]/50 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]/50 transition-shadow text-gray-700"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 p-2 bg-[#E91E63] text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-sm"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
