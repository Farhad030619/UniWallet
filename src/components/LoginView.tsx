
import React from 'react';

interface LoginViewProps {
  onNavigateToSetup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onNavigateToSetup }) => {
  return (
    <div className="p-8 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to UniFlow!</h1>
        <p className="text-gray-500 dark:text-gray-400">Proceed to Login</p>
      </div>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="you@school.com"
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="********"
            className="mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button 
          type="button" 
          disabled
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button onClick={onNavigateToSetup} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Setup!
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
