export interface UserStats {
  hearts: number;
  gems: number;
  streak: number;
  xp: number;
  language: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  locked: boolean;
  completed: boolean;
  stars: number; // 0-3
  color: 'green' | 'purple' | 'yellow';
  position: 'center' | 'left' | 'right';
}

export type QuestionType = 'multiple-choice' | 'translate' | 'listen' | 'speak';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[]; // Can be text or index
  audioText?: string; // For TTS or display text for speaking
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export enum Screen {
  WELCOME = 'WELCOME', // Landing Page
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  LANG_SELECT = 'LANG_SELECT',
  HOME = 'HOME',
  LESSON = 'LESSON',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}
