import React from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';

interface MentionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentionsPanel: React.FC<MentionsPanelProps> = ({ isOpen, onClose }) => {
  const { selectChat, chats } = useChatStore();
  
  // Utility to generate a color based on the name
  const getAvatarColor = (name: string) => {
    // Simple hash to pick a color
    const colors = [
      'bg-green-200 text-green-800',
      'bg-purple-200 text-purple-800',
      'bg-blue-200 text-blue-800',
      'bg-pink-200 text-pink-800',
      'bg-yellow-200 text-yellow-800',
      'bg-gray-200 text-gray-800',
      'bg-red-200 text-red-800',
      'bg-teal-200 text-teal-800',
    ];
    const hash = name.charCodeAt(0) + name.length;
    return colors[hash % colors.length];
  };
  
  // Create mentions data from actual chats
  const mentionsData = chats.map(chat => ({
    id: chat.id,
    name: chat.user.name,
    message: chat.messages[chat.messages.length - 1]?.text || 'No messages yet',
    time: chat.messages[chat.messages.length - 1]?.time || '',
    unread: chat.messages.some(msg => !msg.seen),
    chatId: chat.id,
  }));

  const handleMentionClick = (chatId: string) => {
    selectChat(chatId);
    // Panel will stay open after selecting a chat
  };

  return (
    <div
      className={cn(
        "h-full bg-white transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Mentions</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {mentionsData.filter(m => m.unread).length}
            </span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close mentions panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mentions List */}
        <div className="flex-1 overflow-y-auto">
          {mentionsData.map((mention) => (
            <div 
              key={mention.id} 
              className={cn(
                "px-3 py-2 rounded-xl mx-2 my-1 cursor-pointer flex items-center gap-3 transition-colors hover:bg-gray-50"
              )}
              onClick={() => handleMentionClick(mention.chatId)}
            >
              {/* Avatar as colored circle with initial */}
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full font-bold text-base select-none",
                  getAvatarColor(mention.name)
                )}
              >
                {mention.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-900 truncate">{mention.name}</span>
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{mention.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5 truncate">
                  {mention.message}
                </p>
              </div>
              {mention.unread && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentionsPanel;
