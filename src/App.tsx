
import React, { useState, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import BudgetView from './components/BudgetView';
import CommunityView from './components/CommunityView';
import DealsView from './components/DealsView';
import ProfileView from './components/ProfileView';
import CashBuddyView, { initialBotMessage } from './components/CashBuddyView';
import LoginView from './components/LoginView';
import SetupView from './components/SetupView';
import ProfileSetupView from './components/ProfileSetupView';
import { useMockData } from './hooks/useMockData';
import type { Transaction, Post, Deal, ProfileData, ChatMessage } from './types';

export type View = 'budget' | 'community' | 'cashbuddy' | 'deals' | 'profile';
type AuthView = 'login' | 'setup' | 'profileSetup';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [activeView, setActiveView] = useState<View>('budget');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    posts,
    addPost,
    deals,
    profileData,
    summary,
    updateProfile,
    addSavingGoal,
    deleteSavingGoal,
    addToSavingGoal,
  } = useMockData();

  const handleLogin = () => {
    // For now, this just simulates a successful login.
    setIsAuthenticated(true);
  };

  const handleNavigateToSetup = () => setAuthView('setup');
  const handleNavigateToProfileSetup = () => setAuthView('profileSetup');

  const handleFinishSetup = (profileDetails: Omit<ProfileData, 'photoURL' | 'badges' | 'savingGoals'>) => {
    updateProfile(profileDetails);
    setIsAuthenticated(true);
  };

  const renderAuthView = () => {
    switch (authView) {
      case 'setup':
        return <SetupView onSetupComplete={handleNavigateToProfileSetup} />;
      case 'profileSetup':
        return <ProfileSetupView onFinishSetup={handleFinishSetup} />;
      case 'login':
      default:
        return <LoginView onNavigateToSetup={handleNavigateToSetup} />;
    }
  }

  const renderMainView = useCallback(() => {
    switch (activeView) {
      case 'budget':
        return (
          <BudgetView
            transactions={transactions}
            addTransaction={addTransaction}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransaction}
            summary={summary}
            profileData={profileData}
            addToSavingGoal={addToSavingGoal}
          />
        );
      case 'community':
        return <CommunityView posts={posts} addPost={addPost} />;
      case 'deals':
        return <DealsView deals={deals} />;
      case 'profile':
        return <ProfileView profile={profileData} addSavingGoal={addSavingGoal} deleteSavingGoal={deleteSavingGoal} updateProfile={updateProfile} />;
      case 'cashbuddy':
        return <CashBuddyView messages={chatMessages} setMessages={setChatMessages} />;
      default:
        return <BudgetView transactions={transactions} addTransaction={addTransaction} editTransaction={editTransaction} deleteTransaction={deleteTransaction} summary={summary} profileData={profileData} addToSavingGoal={addToSavingGoal} />;
    }
  }, [activeView, transactions, addTransaction, editTransaction, deleteTransaction, summary, posts, addPost, deals, profileData, chatMessages, addSavingGoal, deleteSavingGoal, updateProfile, addToSavingGoal]);

  if (!isAuthenticated) {
    return (
       <div className="min-h-screen font-sans text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 flex items-center justify-center">
        <div className="container mx-auto max-w-lg">
          {renderAuthView()}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto max-w-lg min-h-screen flex flex-col">
        <main className="flex-grow pb-24">
          {renderMainView()}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
};

export default App;
