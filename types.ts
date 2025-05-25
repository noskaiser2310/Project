
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string; 
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'expert';
  timestamp: number;
  avatar?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId?: string; 
  points?: number; 
}

export interface TestResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  advice?: string; 
}

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  avatarUrl: string;
}

export enum Page {
  Home = '/home',
  Login = '/login',
  Register = '/register',
  AskMe = '/ask-me',
  Test = '/test',
  TestQuiz = '/test/quiz',
  TestResults = '/test/results',
  ContactExpert = '/contact-expert',
}
