
import React from 'react';
import { Bolt, Paperclip, SmilePlus, Clock, Send } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

const MessageInput = () => {
  const messageInput = useChatStore((s) => s.messageInput);
  const setMessageInput = useChatStore((s) => s.setMessageInput);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const disabled = !messageInput.trim();

  const handleSend = () => {
    if (disabled) return;
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 flex flex-col gap-2 sticky bottom-0">
      <div className="flex items-end gap-2">
        <textarea
          className="flex-1 resize-none border border-gray-200 rounded-md p-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Reply to Tom Simone"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className={`ml-2 px-4 py-2 rounded font-semibold flex items-center gap-1 transition ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          onClick={handleSend}
          disabled={disabled}
        >
          Send <Send size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-1 text-gray-500">
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100">
          <Bolt size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100">
          <Paperclip size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100">
          <SmilePlus size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100">
          <Clock size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
