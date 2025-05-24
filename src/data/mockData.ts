
import { User, Conversation, Message } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Luis',
    company: 'Github',
    avatar: '/avatars/luis.jpg',
    status: 'online'
  },
  {
    id: 'u2',
    name: 'Ivan',
    company: 'Nike',
    status: 'online'
  },
  {
    id: 'u3',
    name: 'Lead',
    company: 'from New York',
    status: 'offline'
  },
  {
    id: 'u4',
    name: 'Luis',
    company: 'Small Crafts',
    status: 'offline'
  },
  {
    id: 'u5',
    name: 'Miracle',
    company: 'Exemplary Bank',
    status: 'away'
  }
];

export const createMessage = (id: string, sender: 'user' | 'admin' | 'ai', text: string, timestamp: string, seen = false): Message => ({
  id,
  sender,
  text,
  timestamp,
  seen
});

export const mockMessages: { [key: string]: Message[] } = {
  'c1': [
    createMessage('m1', 'user', 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.', '1min'),
    createMessage('m2', 'admin', 'Let me just look into this for you, Luis.', '1min', true),
  ],
  'c2': [
    createMessage('m3', 'user', 'Hi there, I have a question about your Nike shoes. Do you have them in size 10?', '30m'),
    createMessage('m4', 'admin', 'Let me check our inventory for you.', '25m'),
    createMessage('m5', 'admin', 'Yes, we have Nike Air Max in size 10. Would you like me to reserve a pair for you?', '24m'),
  ],
  'c3': [
    createMessage('m6', 'user', 'Good morning, let me know if you have any special offers this week.', '45m'),
  ],
  'c4': [
    createMessage('m7', 'user', 'Bug report', '45m'),
    createMessage('m8', 'admin', 'Thanks for reporting this issue. Our developers will look into it.', '40m'),
  ],
  'c5': [
    createMessage('m9', 'user', 'Hey there, I\'m here to discuss my loan application.', '45m'),
    createMessage('m10', 'admin', 'I\'d be happy to help with your loan application. Could you provide your reference number?', '40m'),
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    user: mockUsers[0],
    lastMessage: mockMessages['c1'][mockMessages['c1'].length - 1],
    messages: mockMessages['c1'],
    unread: false
  },
  {
    id: 'c2',
    user: mockUsers[1],
    lastMessage: mockMessages['c2'][mockMessages['c2'].length - 1],
    messages: mockMessages['c2'],
    unread: true,
    tags: ['lemon']
  },
  {
    id: 'c3',
    user: mockUsers[2],
    lastMessage: mockMessages['c3'][mockMessages['c3'].length - 1],
    messages: mockMessages['c3'],
    unread: false,
    tags: ['priority']
  },
  {
    id: 'c4',
    user: mockUsers[3],
    lastMessage: mockMessages['c4'][mockMessages['c4'].length - 1],
    messages: mockMessages['c4'],
    unread: false,
    tags: ['bug']
  },
  {
    id: 'c5',
    user: mockUsers[4],
    lastMessage: mockMessages['c5'][mockMessages['c5'].length - 1],
    messages: mockMessages['c5'],
    unread: false
  },
];

export const mockSuggestions = [
  "How do I get a refund?",
  "What's your return policy?",
  "Can I exchange my order?",
  "Where is my order?"
];
