
import React, { useState } from 'react';
import type { ProfileData, SavingGoal } from '../types';
import { TrashIcon, SettingsIcon } from './icons';
import { ImageCropModal } from './ImageCropModal';

interface ProfileViewProps {
  profile: ProfileData;
  addSavingGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  deleteSavingGoal: (goalId: string) => void;
  updateProfile: (details: Partial<ProfileData>) => void;
}

const GoalSetupModal: React.FC<{
  onClose: () => void;
  onSave: (goal: { name: string; targetAmount: number; savedAmount: number }) => void;
}> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');

  const canSave = name && targetAmount && savedAmount;

  const handleSave = () => {
    if (canSave) {
      onSave({
        name,
        targetAmount: parseFloat(targetAmount),
        savedAmount: parseFloat(savedAmount),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Set Your Saving Goal</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product/Goal</label>
            <input
              type="text"
              id="goalName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., New MacBook Pro"
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">How much does it cost? (SEK)</label>
            <input
              type="number"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="13590"
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="savedAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">How much have you saved? (SEK)</label>
            <input
              type="number"
              id="savedAmount"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              placeholder="8560"
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!canSave} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal: React.FC<{
  profile: ProfileData;
  onClose: () => void;
  onSave: (details: Partial<ProfileData>) => void;
}> = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    school: profile.school,
    bio: profile.bio,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const canSave = formData.displayName && formData.school && formData.bio;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!canSave} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};


const ConfirmationModal: React.FC<{
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">{message}</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="w-full bg-gray-200 dark:bg-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
          <button onClick={onConfirm} className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
);


const ProfileView: React.FC<ProfileViewProps> = ({ profile, addSavingGoal, deleteSavingGoal, updateProfile }) => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSavePhoto = (photoURL: string) => {
    updateProfile({ photoURL });
  };
  
  const handleSaveProfileDetails = (details: Partial<ProfileData>) => {
      updateProfile(details);
  };

  const handleDeleteGoal = () => {
    if (goalToDelete) {
      deleteSavingGoal(goalToDelete);
      setGoalToDelete(null);
    }
  };

  const renderSavingGoals = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-4">
        <h3 className="font-bold text-lg">Saving Goals</h3>
        {profile.savingGoals.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Set a goal to stay motivated!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.savingGoals.map(goal => {
              const { id, name, savedAmount, targetAmount } = goal;
              const goalProgress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
              const isGoalComplete = savedAmount >= targetAmount;

              return (
                <div key={id} className="border-t dark:border-gray-700 pt-4 relative first:border-t-0 first:pt-0">
                  <button
                    onClick={() => setGoalToDelete(id)}
                    className="absolute top-4 right-0 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    aria-label="Delete saving goal"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <h4 className="font-semibold text-base mb-2 pr-8">{name}</h4>
                  {isGoalComplete && (
                      <p className="text-base font-bold text-green-500 my-2 animate-pulse">
                          Grattis! Du har nått ditt mål! 🥳
                      </p>
                  )}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div className={`h-4 rounded-full transition-all duration-500 ${isGoalComplete ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, goalProgress)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{savedAmount.toLocaleString('sv-SE')} SEK</span>
                    <span className="text-gray-500 dark:text-gray-400">{targetAmount.toLocaleString('sv-SE')} SEK</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button
            onClick={() => setIsGoalModalOpen(true)}
            className="w-full mt-4 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-6 py-2 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 transition"
        >
            + Add New Goal
        </button>
      </div>
    );
  };

  const goalBeingDeleted = profile.savingGoals.find(g => g.id === goalToDelete);

  return (
    <>
      {isGoalModalOpen && <GoalSetupModal onClose={() => setIsGoalModalOpen(false)} onSave={addSavingGoal} />}
      {isCropModalOpen && (
        <ImageCropModal
          onClose={() => setIsCropModalOpen(false)}
          onSave={handleSavePhoto}
        />
      )}
       {isSettingsModalOpen && (
        <SettingsModal 
            profile={profile}
            onClose={() => setIsSettingsModalOpen(false)}
            onSave={handleSaveProfileDetails}
        />
      )}
      {goalToDelete && goalBeingDeleted && (
        <ConfirmationModal
          title="Delete Goal?"
          message={`Are you sure you want to delete the "${goalBeingDeleted.name}" goal? This action cannot be undone.`}
          onConfirm={handleDeleteGoal}
          onCancel={() => setGoalToDelete(null)}
        />
      )}
      <div className="p-4 space-y-6">
        <header className="relative flex flex-col items-center text-center space-y-2">
           <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="absolute top-0 right-0 p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Edit profile details"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>
          <button
            onClick={() => setIsCropModalOpen(true)}
            className="relative group"
            aria-label="Change profile picture"
          >
            <img className="w-24 h-24 rounded-full shadow-lg border-4 border-white dark:border-gray-800 object-cover" src={profile.photoURL} alt={profile.displayName} />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.displayName}</h1>
          <p className="text-gray-500 dark:text-gray-400">{profile.school}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">{profile.bio}</p>
        </header>

        {renderSavingGoals()}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h3 className="font-bold mb-3">Badges</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {profile.badges.map(badge => (
              <div key={badge.code} className="flex flex-col items-center">
                <span className="text-3xl p-3 bg-gray-100 dark:bg-gray-700 rounded-full">{badge.icon}</span>
                <p className="text-xs mt-1 font-medium">{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileView;
