
export interface User {
  id: string;
  name: string;
  avatar?: string;
  company?: string;
  status: 'online' | 'offline' | 'away';
}

export interface Message {
  id: string;
  sender: 'user' | 'admin' | 'ai';
  text: string;
  timestamp: string;
  seen?: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  messages: Message[];
  unread: boolean;
  tags?: string[];
  assignee?: string;
}
