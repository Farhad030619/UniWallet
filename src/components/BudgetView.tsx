
import React, { useState, useEffect } from 'react';
import type { Transaction, BudgetSummary, TransactionType, ProfileData, SavingGoal } from '../types';
import { TrashIcon, PencilIcon } from './icons';

interface BudgetViewProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
  summary: BudgetSummary;
  profileData: ProfileData;
  addToSavingGoal: (goalId: string, amount: number) => void;
}

const StatCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{amount.toLocaleString('sv-SE')} SEK</p>
    </div>
);

const ConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Delete Transaction?</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">Are you sure? This action cannot be undone.</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="w-full bg-gray-200 dark:bg-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
          <button onClick={onConfirm} className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
);

const AddFundsModal: React.FC<{
  goalName: string;
  onClose: () => void;
  onAdd: (amount: number) => void;
}> = ({ goalName, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onAdd(parsedAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Add to "{goalName}"</h2>
        <div>
          <label htmlFor="fundAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (SEK)</label>
          <input
            type="number"
            id="fundAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
          <button onClick={handleAdd} disabled={!amount || parseFloat(amount) <= 0} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">Add Funds</button>
        </div>
      </div>
    </div>
  );
};

const BudgetView: React.FC<BudgetViewProps> = ({ transactions, addTransaction, editTransaction, deleteTransaction, summary, profileData, addToSavingGoal }) => {
    const [formVisible, setFormVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    const [formState, setFormState] = useState({ amount: '', category: '', note: '' });
    const [type, setType] = useState<TransactionType>('expense');
    const [fundingGoal, setFundingGoal] = useState<SavingGoal | null>(null);

    const resetForm = () => {
      setFormState({ amount: '', category: '', note: '' });
      setType('expense');
      setIsEditMode(false);
      setTransactionToEdit(null);
      setFormVisible(false);
    };

    const handleAddNewClick = () => {
      resetForm();
      setIsEditMode(false);
      setFormVisible(true);
    };

    const handleEditClick = (transaction: Transaction) => {
      setTransactionToEdit(transaction);
      setIsEditMode(true);
      setFormState({
        amount: transaction.amount.toString(),
        category: transaction.category,
        note: transaction.note,
      });
      setType(transaction.type);
      setFormVisible(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.amount && formState.category) {
            const transactionData = {
                amount: parseFloat(formState.amount),
                category: formState.category,
                note: formState.note,
                type,
            };

            if (isEditMode && transactionToEdit) {
                editTransaction({ ...transactionToEdit, ...transactionData });
            } else {
                addTransaction(transactionData);
            }
            resetForm();
        }
    };
    
    const handleDelete = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete.id);
            setTransactionToDelete(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
    }

    const renderSavingGoals = () => {
      if (!profileData.savingGoals || profileData.savingGoals.length === 0) {
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">You have no saving goals yet. Go to your profile to add one!</p>
          </div>
        );
      }
      
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Saving Goals</h2>
          {profileData.savingGoals.map(goal => {
            const { id, name, savedAmount, targetAmount } = goal;
            const goalProgress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
            const isGoalComplete = savedAmount >= targetAmount;
      
            return (
              <div key={id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{name}</h3>
                    {isGoalComplete && (
                      <p className="text-sm font-bold text-green-500 animate-pulse">Grattis! Målet uppnått! 🎉</p>
                    )}
                  </div>
                  {!isGoalComplete && (
                    <button onClick={() => setFundingGoal(goal)} className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-green-600 transition">Add Funds</button>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div className={`h-4 rounded-full transition-all duration-500 ${isGoalComplete ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, goalProgress)}%` }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{savedAmount.toLocaleString('sv-SE')} SEK</span>
                  <span className="text-gray-500 dark:text-gray-400">{targetAmount.toLocaleString('sv-SE')} SEK</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
        <>
        {transactionToDelete && <ConfirmationModal onConfirm={handleDelete} onCancel={() => setTransactionToDelete(null)} />}
        {fundingGoal && (
            <AddFundsModal
                goalName={fundingGoal.name}
                onClose={() => setFundingGoal(null)}
                onAdd={(amount) => {
                    addToSavingGoal(fundingGoal.id, amount);
                    setFundingGoal(null);
                }}
            />
        )}
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">Your financial summary for this month.</p>
            </header>

            <div className="bg-blue-600 dark:bg-blue-800 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                    <p className="text-sm opacity-80">Current Balance</p>
                    <p className="text-4xl font-extrabold">{summary.balance.toLocaleString('sv-SE')} SEK</p>
                </div>
            </div>

            <div className="flex gap-4">
                <StatCard title="Income" amount={summary.income} color="text-green-500" />
                <StatCard title="Expenses" amount={summary.expenses} color="text-red-500" />
            </div>

            {renderSavingGoals()}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                    <button onClick={formVisible ? resetForm : handleAddNewClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                        {formVisible ? 'Cancel' : 'Add New'}
                    </button>
                </div>

                {formVisible && (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
                         <h3 className="font-bold text-center text-lg">{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                        <div className="flex gap-2 mb-4">
                            <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Expense</button>
                            <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Income</button>
                        </div>
                        <input type="number" value={formState.amount} onChange={e => setFormState({...formState, amount: e.target.value})} placeholder="Amount (SEK)" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
                        <input type="text" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} placeholder="Category (e.g., Food)" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
                        <input type="text" value={formState.note} onChange={e => setFormState({...formState, note: e.target.value})} placeholder="Note (optional)" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                            {isEditMode ? 'Update Transaction' : 'Add Transaction'}
                        </button>
                    </form>
                )}

                <ul className="space-y-3">
                    {transactions.length === 0 && !formVisible && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No transactions yet. Add one to get started!</p>
                    )}
                    {transactions.map(t => (
                        <li key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center">
                            <div className="flex-1">
                                <p className="font-bold">{t.category}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t.note}</p>
                            </div>
                            <div className="text-right mr-4">
                                <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('sv-SE')} SEK
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(t.date)}</p>
                            </div>
                             <div className="flex gap-2">
                                <button onClick={() => handleEditClick(t)} className="p-2 text-gray-400 hover:text-blue-500 transition"><PencilIcon className="w-5 h-5" /></button>
                                <button onClick={() => setTransactionToDelete(t)} className="p-2 text-gray-400 hover:text-red-500 transition"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    );
};

export default BudgetView;
