// Zustand chat store for admin inbox dashboard

import { create } from 'zustand';

export type Message = {
  sender: 'user' | 'admin';
  text: string;
  time: string;
  seen?: boolean;
};

export type User = {
  name: string;
  company: string;
  avatar: string;
};

export type Chat = {
  id: string;
  user: User;
  messages: Message[];
  tags: string[];
};

type ChatStore = {
  chats: Chat[];
  selectedChatId: string | null;
  copilotOpen: boolean;
  automationOn: boolean;
  messageInput: string;
  setMessageInput: (val: string) => void;
  selectChat: (id: string) => void;
  sendMessage: (text?: string) => void;
  toggleCopilot: () => void;
  toggleAutomation: () => void;
  expandedPanel: 'sidebar' | 'chat' | 'copilot' | null;
  setExpandedPanel: (panel: 'sidebar' | 'chat' | 'copilot' | null) => void;
};

const dummyChats: Chat[] = [
  {
    id: '1',
    user: { name: 'Luis', company: 'Github', avatar: '/avatars/luis.png' },
    messages: [
      { sender: 'user', text: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.', time: '1m ago' },
      { sender: 'admin', text: 'Let me just look into this for you, Luis.', time: '1m ago', seen: true },
    ],
    tags: ['Open', 'Bug Report'],
  },
  {
    id: '2',
    user: { name: 'Nikola', company: 'Tesla', avatar: '/avatars/nikola.png' },
    messages: [
      { sender: 'user', text: 'I placed the order over 60 days ago 😓. Could you make an exception, please?', time: '21m ago' },
      { sender: 'admin', text: 'We can only refund orders from the last 60 days.', time: '20m ago', seen: true },
    ],
    tags: ['Priority', 'Lemon'],
  },
  {
    id: '3',
    user: { name: 'Ada', company: 'Lovelace Inc.', avatar: '/avatars/ada.png' },
    messages: [
      { sender: 'user', text: 'Good morning, let me know if you have any special offers this week.', time: '45m ago' },
    ],
    tags: ['Open'],
  },
];

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: dummyChats,
  selectedChatId: dummyChats[0].id,
  copilotOpen: true,
  automationOn: false,
  messageInput: '',
  setMessageInput: (val) => set({ messageInput: val }),
  selectChat: (id) => set({ selectedChatId: id }),
  sendMessage: (text) => {
    const { chats, selectedChatId, messageInput } = get();
    const sendText = text !== undefined ? text : messageInput;
    if (!sendText.trim()) return;
    set({
      chats: chats.map(chat =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: 'admin', text: sendText, time: 'Just now', seen: false },
              ],
            }
          : chat
      ),
      messageInput: '',
    });
  },
  toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),
  toggleAutomation: () => set((state) => ({ automationOn: !state.automationOn })),
  expandedPanel: null,
  setExpandedPanel: (panel) => set({ expandedPanel: panel }),
}));
