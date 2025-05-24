import React from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { Bot, ArrowUp, PanelRightClose } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  suggestion?: string;
  isTyping?: boolean;
}

const suggestions = [
  'How do I get a refund?',
  'How long does shipping take?',
  'Can I change my order?',
];

const detailsSections = [
  'LINKS',
  'USER DATA',
  'CONVERSATION ATTRIBUTES',
  'COMPANY DETAILS',
  'SALESFORCE',
  'STRIPE',
  'JIRA FOR TICKETS',
];

const refundReply = `To process your refund, please provide your order ID and proof of purchase. We can only refund orders within the last 60 days. Once verified, I'll send you a returns QR code for shipping.`;

// CopilotPanel: AI suggestions, animated, collapsible
const CopilotPanel = ({ style }: { style?: React.CSSProperties }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const { expandedPanel, setExpandedPanel, setMessageInput } = useChatStore();
  const [tab, setTab] = React.useState<'copilot' | 'details'>('copilot');
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [isTyping, setIsTyping] = React.useState(false);
  const [typingText, setTypingText] = React.useState('');
  const typingInterval = 18; // ms per character
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isAI: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Check for refund question (case-insensitive, simple match)
    if (/refund/i.test(inputValue)) {
      setIsTyping(true);
      setTypingText('');
      // Add a temporary AI typing message
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 0.5).toString(),
          text: '',
          isAI: true,
          suggestion: '',
          isTyping: true // custom property
        }
      ]);
      let i = 0;
      const typeNext = () => {
        setTypingText(refundReply.slice(0, i + 1));
        if (i < refundReply.length - 1) {
          i++;
          setTimeout(typeNext, typingInterval);
        } else {
          setIsTyping(false);
          setMessages(prev => {
            // Remove the temporary typing message
            const filtered = prev.filter(m => !(m.isAI && m.isTyping));
            return [
              ...filtered,
              {
                id: (Date.now() + 1).toString(),
                text: refundReply,
                isAI: true,
                suggestion: refundReply
              }
            ];
          });
          setTypingText('');
        }
      };
      setTimeout(typeNext, typingInterval);
      return;
    }

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Here's a suggested response to your question:",
        isAI: true,
        suggestion: "Thank you for your inquiry. I'll be happy to help you with that. Let me look into this for you and get back to you shortly."
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleAddToComposer = (suggestion: string) => {
    setMessageInput(suggestion);
  };

  const handleSectionToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // Auto-scroll to bottom when messages or typing changes
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, typingText]);

  return (
    <div className="flex flex-col h-full w-full bg-white relative" style={style}>
      {/* Tabs header */}
      <div className="flex items-center px-6 pt-4 pb-2 border-b border-gray-200 bg-white relative h-[64px] box-border z-10">
        {/* Blue underline for active tab (absolutely positioned, does not affect border) */}
        <div className="absolute bottom-0 h-0.5 rounded-full transition-all duration-200 pointer-events-none z-0"
          style={{
            left: tab === 'copilot' ? 24 : 110,
            width: tab === 'copilot' ? 90 : 60,
            background: '#5b3df6'
          }}
        />
        <button
          onClick={() => setTab('copilot')}
          className={`font-semibold text-base focus:outline-none ${tab === 'copilot' ? 'text-[#5b3df6]' : 'text-gray-500'}`}
        >
          AI Copilot
        </button>
        <button
          onClick={() => setTab('details')}
          className={`ml-6 font-medium text-base focus:outline-none ${tab === 'details' ? 'text-[#5b3df6]' : 'text-gray-500'}`}
        >
          Details
        </button>
        <button
          className="ml-auto p-2 rounded hover:bg-gray-100"
          onClick={() => setExpandedPanel(null)}
          title="Collapse"
        >
          <PanelRightClose size={20} className="text-gray-600" />
        </button>
      </div>
      {/* Body (scrollable area) */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full relative z-10">
        {tab === 'copilot' ? (
          <>
            {/* Messages Area */}
            <div className="flex-1 w-full p-4 space-y-4 overflow-y-auto" style={{maxHeight: '100%'}}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.isAI
                        ? ''
                        : 'bg-white border border-gray-100 rounded-lg p-3 shadow'
                    }`}
                  >
                    {!message.isAI && <p className="text-sm text-black">{message.text}</p>}
                    {/* Typing animation as a separate message */}
                    {message.isAI && (message as any).isTyping && (
                      <div
                        className="rounded-2xl shadow p-6 w-full max-w-xl mx-auto flex flex-col gap-6 animate-pulse border border-violet-100 bg-gradient-to-br from-violet-50 to-violet-100"
                      >
                        <div className="text-[16px] text-gray-900 leading-relaxed whitespace-pre-line">
                          {typingText}
                          <span className="inline-block w-2 h-5 align-middle bg-gray-400 animate-blink ml-1" style={{borderRadius:2}}></span>
                        </div>
                      </div>
                    )}
                    {/* Normal AI message with suggestion */}
                    {message.isAI && message.suggestion && !((message as any).isTyping) && (
                      <div
                        className="rounded-2xl shadow p-6 w-full max-w-xl mx-auto flex flex-col gap-6"
                        style={{
                          background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 60%, #f0fdfa 100%)',
                          boxShadow: '0 2px 8px 0 rgba(80, 60, 180, 0.06)',
                        }}
                      >
                        <div className="text-[16px] text-gray-900 leading-relaxed whitespace-pre-line">
                          {message.suggestion}
                        </div>
                        <button
                          onClick={() => handleAddToComposer(message.suggestion!)}
                          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-900 text-base py-3 hover:bg-gray-50 transition shadow-sm"
                        >
                          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1" viewBox="0 0 20 20"><path d="M4 17v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><circle cx="10" cy="7" r="4"/></svg>
                          Add to composer
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div ref={chatEndRef} />
            {/* Suggestions Row & Input */}
            <div className="w-full sticky bottom-0 left-0 bg-white px-6 py-3 flex flex-col gap-2 z-10">
              {/* Suggestions Row */}
              <div className="mb-2">
                <button
                  className="inline-block bg-white rounded-lg shadow border border-gray-100 px-4 py-2 cursor-pointer transition hover:shadow-md hover:opacity-90"
                  style={{ outline: 'none' }}
                  onClick={() => setInputValue(suggestions[0])}
                >
                  <span className="font-bold text-sm text-[#4F46E5]">Suggested</span>
                  <span className="mx-1">🤑</span>
                  <span className="text-sm text-[#4F46E5]">{suggestions[0]}</span>
                </button>
              </div>
              {/* Input Row */}
              <div className="flex items-center w-full bg-white rounded-lg shadow border border-gray-100 px-3 py-2 hover:shadow-md transition">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Send"
                >
                  <ArrowUp className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full w-full">
            <div className="grid grid-cols-2 gap-4 px-6 pt-6 pb-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Assignee</div>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                  <span className="text-sm font-medium text-gray-800">Brian Byrne</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Team</div>
                <div className="flex items-center">
                  <svg width="18" height="18" fill="none" viewBox="0 0 20 20" className="mr-1">
                    <circle cx="10" cy="10" r="8" stroke="#A0A0A0" strokeWidth="2" fill="none"/>
                    <path d="M7 13h6M8 10h4M9 7h2" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm text-gray-800">Unassigned</span>
                </div>
              </div>
            </div>
            <div className="px-6 pt-4 flex-1 overflow-y-auto">
              {detailsSections.map((section) => (
                <div key={section} className="border-b border-gray-100">
                  <button
                    className="w-full flex items-center justify-between py-3 text-gray-800 font-medium text-sm focus:outline-none"
                    onClick={() => handleSectionToggle(section)}
                  >
                    <span>{section.replace(/_/g, ' ')}</span>
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 20 20"
                      className={`transition-transform duration-200 ${openSection === section ? 'rotate-180' : 'rotate-90'}`}
                    >
                      <path d="M6 8l4 4 4-4" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {openSection === section && (
                    <div className="pl-2 pb-4 text-xs text-gray-500 animate-fade-in">
                      {section === 'LINKS' ? (
                        <div className="flex flex-col gap-2 bg-gray-50 rounded p-3 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-gray-800"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="3" y="9" width="14" height="2" rx="1" fill="#5b3df6"/></svg>Tracker ticket</span>
                            <button className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"><span className="text-lg font-bold text-gray-500">+</span></button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-gray-800"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="3" y="9" width="14" height="2" rx="1" fill="#5b3df6"/></svg>Back-office tickets</span>
                            <button className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"><span className="text-lg font-bold text-gray-500">+</span></button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-gray-800"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="3" y="9" width="14" height="2" rx="1" fill="#5b3df6"/></svg>Side conversations</span>
                            <button className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"><span className="text-lg font-bold text-gray-500">+</span></button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded p-3 border border-gray-100">
                          {section.replace(/_/g, ' ')} content goes here.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopilotPanel;
