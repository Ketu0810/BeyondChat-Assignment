import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Sun, X, Maximize2, Minimize2, Filter, Bookmark, RefreshCw, Star, Phone, Moon, Square, Smile, Rocket } from 'lucide-react';
import MessageInput from './MessageInput';

// Define constants for textarea sizing
const CHAT_INPUT_MIN_HEIGHT = 38; // px
const CHAT_INPUT_MAX_HEIGHT = 300; // px

// ChatThread: Chat bubbles, scrollable, animated
const ChatThread = ({ expanded = false }: { expanded?: boolean }) => {
  const { chats, selectedChatId, expandedPanel, setExpandedPanel } = useChatStore();
  const chat = chats.find((c) => c.id === selectedChatId);
  if (!chat)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 select-none">
        <span className="text-7xl mb-4" style={{ fontFamily: 'monospace' }}>&#128400;</span>
        <div className="text-lg">Select a conversation to get started</div>
      </div>
    );
  const lastMessages = chat.messages.slice(-5);

  // For auto-resizing textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageInput = useChatStore(s => s.messageInput);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${CHAT_INPUT_MIN_HEIGHT}px`; // reset to min height
      textarea.style.height = Math.min(textarea.scrollHeight, CHAT_INPUT_MAX_HEIGHT) + 'px';
    }
  }, [messageInput]);

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-gray-200 bg-white h-[64px] box-border">
        {/* Name on the left */}
        <div className="font-semibold text-xl text-black">{chat.user.name}</div>
        {/* Center icons */}
        <div className="flex items-center gap-3 ml-auto mr-4">
          {/* Star icon */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" title="Star">
            <Star className="w-5 h-5 text-black" fill="black" />
          </button>
          {/* More icon */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" title="More">
            <MoreHorizontal className="w-5 h-5 text-black" fill="black" />
          </button>
          {/* Rectangle icon */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" title="Rectangle">
            <Square className="w-5 h-5 text-black" fill="black" />
          </button>
          {/* Phone icon */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" title="Call">
            <Phone className="w-5 h-5 text-black" fill="black" />
          </button>
          {/* Moon icon */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" title="Moon">
            <Moon className="w-5 h-5 text-black" fill="black" />
          </button>
        </div>
        {/* Close button on the right, icon and text */}
        <button className="flex items-center gap-2 px-4 h-8 bg-black text-white rounded-full font-semibold text-base hover:bg-gray-800 transition" title="Close">
          <X className="w-5 h-5" />
          <span className="text-sm font-medium">Close</span>
        </button>
      </div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-white">
        <AnimatePresence initial={false}>
          {lastMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-base flex items-end gap-2 ${msg.sender === 'user' ? 'bg-gray-100 text-gray-900 rounded-tl-sm' : 'bg-[#e7eafd] text-gray-900 rounded-tr-sm'}`}>
                {msg.sender === 'admin' && (
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="admin" className="w-6 h-6 rounded-full ml-2 order-2" />
                )}
                <div className="flex-1">
                  <div>{msg.text}</div>
                  <div className="flex items-center mt-1 text-xs text-gray-400 justify-end gap-1">
                    {msg.sender === 'admin' && msg.seen && <span>Seen ·</span>}
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Sticky message input */}
      <div className="sticky bottom-0 z-10 bg-white px-4 py-4">
        <div className="w-full max-w-3xl mx-auto rounded-xl shadow border border-gray-100 bg-white py-4 hover:shadow-md transition">
          {/* Top row: Chat dropdown */}
          <div className="flex items-center px-6 pt-1 pb-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2"><path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7l-4 4V5z" stroke="#000" strokeWidth="2" strokeLinejoin="round" fill="black" /></svg>
            <span className="font-medium text-gray-700 mr-2">Chat</span>
            <svg width="16" height="16" fill="black" stroke="currentColor" strokeWidth="2" className="ml-1 text-gray-400"><path d="M4 6l4 4 4-4" /></svg>
          </div>
          {/* Hint text */}
          <div className="px-6 pt-0 pb-1 text-gray-400 text-sm">Use <span className="font-mono">⌘K</span> for shortcuts</div>
          {/* Input row */}
          <div className="flex flex-col px-2 sm:px-4 md:px-6 pb-0 min-h-0 w-full gap-2">
            <textarea
              ref={textareaRef}
              className="min-w-0 bg-white px-2 py-2 text-gray-900 text-base outline-none border-0 shadow-none resize-none focus:ring-0 focus:border-0"
              placeholder="Type your message..."
              value={messageInput}
              onChange={e => useChatStore.getState().setMessageInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  useChatStore.getState().sendMessage();
                }
              }}
              rows={1}
              style={{ minHeight: `${CHAT_INPUT_MIN_HEIGHT}px`, maxHeight: `${CHAT_INPUT_MAX_HEIGHT}px`, overflow: 'auto' }}
              autoComplete="off"
            />
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition" title="Filter" onClick={() => alert('Filter clicked!')}>
                  <Rocket size={20} stroke="black" fill="black" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition" title="Bookmark" onClick={() => alert('Bookmark clicked!')}>
                  <Bookmark size={20} stroke="black" fill="black" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition" title="Refresh" onClick={() => alert('Refresh clicked!')}>
                  <Smile size={20} stroke="white" fill="black" />
                </button>
              </div>
              <button
                className="flex items-center gap-1 px-4 py-1.5 font-semibold text-gray-700 hover:text-gray-900 cursor-pointer h-[38px] border-0 bg-white shadow-none"
                style={{ height: '38px' }}
                onClick={() => useChatStore.getState().sendMessage()}
                disabled={!useChatStore.getState().messageInput.trim()}
              >
                Send
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><path d="M4 6l4 4 4-4" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
