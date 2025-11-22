import { useState, useMemo } from 'react';
import type { Transaction, Post, Deal, ProfileData, BudgetSummary, SavingGoal } from '../types';

const initialTransactions: Transaction[] = [];

const initialPosts: Post[] = [
  { id: 'p1', author: 'Anna S.', authorAvatar: 'https://picsum.photos/id/237/100/100', text: 'Just managed to save 500 SEK this month by cooking at home! Small wins! 🎉', createdAt: '2 hours ago', likes: 15, comments: 4 },
  { id: 'p2', author: 'Björn L.', authorAvatar: 'https://picsum.photos/id/238/100/100', text: 'Anyone have tips for cheap textbooks? The prices are insane this semester.', createdAt: '1 day ago', likes: 8, comments: 12, imageUrl: 'https://picsum.photos/seed/picsum/400/200' },
  { id: 'p3', author: 'Carla M.', authorAvatar: 'https://picsum.photos/id/239/100/100', text: 'My saving goal for a trip to Lofoten is 30% complete! So motivated right now.', createdAt: '3 days ago', likes: 42, comments: 7 },
];

const mockDeals: Deal[] = [
    { id: 'd1', title: '50% off Coffee', description: 'Get half price on any coffee at Espresso House with your student ID.', link: '#', expiresAt: '2024-12-31', tags: ['Food & Drink'] },
    { id: 'd2', title: '15% off at Apple', description: 'Student discount on MacBooks and iPads. Perfect for your studies.', link: '#', expiresAt: '2025-01-15', tags: ['Tech', 'Education'] },
    { id: 'd3', title: 'Student price on SL', description: 'Travel cheaper in Stockholm with the student monthly pass.', link: '#', expiresAt: '2024-11-30', tags: ['Transport'] },
    { id: 'd4', title: '10% off Course Literature', description: 'Discount at Akademibokhandeln on all your course books.', link: '#', expiresAt: '2024-09-30', tags: ['Books', 'Education'] },
];

// Default user icon SVG as a data URI
const defaultAvatar = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'%3e%3cpath fill-rule='evenodd' d='M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' clip-rule='evenodd'/%3e%3c/svg%3e";


const initialProfile: ProfileData = {
    displayName: 'Fredrik Åkare',
    school: 'KTH Royal Institute of Technology',
    bio: 'CS student trying to save up for a new laptop. Avid budgeter and coffee enthusiast.',
    photoURL: defaultAvatar,
    badges: [
        { code: 'SAVER_1', title: 'Budget Beginner', icon: '💰' },
        { code: 'STREAK_7', title: '7-Day Streak', icon: '🔥' },
        { code: 'COMMUNITY_1', title: 'First Post', icon: '✍️' },
    ],
    savingGoals: [],
};

export const useMockData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfile);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
        prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (transactionId: string) => {
    const transactionToDelete = transactions.find(t => t.id === transactionId);
    if (!transactionToDelete) return;

    // Check if it's a transaction linked to a saving goal
    if (transactionToDelete.category === 'Saving' && transactionToDelete.note.startsWith('Added to "')) {
      // Extract goal name from the note, e.g., "Added to "New Laptop" goal"
      const goalNameMatch = transactionToDelete.note.match(/Added to "([^"]+)" goal/);
      if (goalNameMatch && goalNameMatch[1]) {
        const goalName = goalNameMatch[1];
        
        // Find the goal by name and update its savedAmount
        setProfileData(prev => {
          const goalExists = prev.savingGoals.some(g => g.name === goalName);
          if (!goalExists) {
            // If goal was deleted, just remove transaction without touching profile
            return prev;
          }

          return {
            ...prev,
            savingGoals: prev.savingGoals.map(g => 
              g.name === goalName
                // Subtract amount and ensure it doesn't go below zero
                ? { ...g, savedAmount: Math.max(0, g.savedAmount - transactionToDelete.amount) }
                : g
            ),
          };
        });
      }
    }

    // Finally, remove the transaction from the list
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const updateProfile = (newDetails: Partial<ProfileData>) => {
      setProfileData(prev => ({ ...prev, ...newDetails }));
  }

  const addSavingGoal = (goal: Omit<SavingGoal, 'id'>) => {
    const newGoal: SavingGoal = {
        ...goal,
        id: new Date().getTime().toString(),
    };
    setProfileData(prev => ({
        ...prev,
        savingGoals: [...prev.savingGoals, newGoal]
    }));
  };

  const deleteSavingGoal = (goalId: string) => {
    setProfileData(prev => ({
        ...prev,
        savingGoals: prev.savingGoals.filter(g => g.id !== goalId),
    }));
  };

  const addToSavingGoal = (goalId: string, amount: number) => {
    const goal = profileData.savingGoals.find(g => g.id === goalId);
    if (!goal) return;

    // Create an expense transaction for the saving action
    addTransaction({
      amount: amount,
      type: 'expense',
      category: 'Saving',
      note: `Added to "${goal.name}" goal`,
    });

    // Update the saved amount in the profile
    setProfileData(prev => ({
      ...prev,
      savingGoals: prev.savingGoals.map(g => 
        g.id === goalId 
          ? { ...g, savedAmount: g.savedAmount + amount }
          : g
      ),
    }));
  };
  
  const addPost = (post: { text: string; imageUrl?: string }) => {
    const newPost: Post = {
        ...post,
        id: new Date().getTime().toString(),
        author: profileData.displayName,
        authorAvatar: profileData.photoURL,
        createdAt: 'Just now',
        likes: 0,
        comments: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const summary: BudgetSummary = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else {
        acc.expenses += t.amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    }, { income: 0, expenses: 0, balance: 0 });
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    summary,
    posts,
    addPost,
    deals: mockDeals,
    profileData,
    updateProfile,
    addSavingGoal,
    deleteSavingGoal,
    addToSavingGoal,
  };
};
