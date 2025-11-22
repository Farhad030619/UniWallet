
import React, { useState } from 'react';

interface ProfileSetupViewProps {
  onFinishSetup: (details: { displayName: string; school: string; bio: string; }) => void;
}

const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onFinishSetup }) => {
    const [displayName, setDisplayName] = useState('');
    const [age, setAge] = useState('');
    const [school, setSchool] = useState('');
    const [bio, setBio] = useState('');

    const canProceed = displayName && age && school && bio;

    const handleSubmit = () => {
        if (canProceed) {
            onFinishSetup({ displayName, school, bio });
        }
    }

  return (
    <div className="p-8 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tell Us About Yourself</h1>
        <p className="text-gray-500 dark:text-gray-400">This will help personalize your experience.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input 
            type="text" 
            id="displayName" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your Name"
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
          <input 
            type="number" 
            id="age" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="21"
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School</label>
          <input 
            type="text" 
            id="school" 
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="KTH Royal Institute of Technology"
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
         <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about yourself..."
            rows={3}
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={!canProceed}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
};

export default ProfileSetupView;
