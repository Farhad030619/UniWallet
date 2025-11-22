
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
}

export interface BudgetSummary {
    income: number;
    expenses: number;
    balance: number;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  link: string;
  expiresAt: string;
  tags: string[];
}

export interface Badge {
  code: string;
  title: string;
  icon: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
}

export interface ProfileData {
  displayName: string;
  school: string;
  bio: string;
  photoURL: string;
  badges: Badge[];
  savingGoals: SavingGoal[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}