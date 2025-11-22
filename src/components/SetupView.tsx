import React, { useState } from 'react';

interface SetupViewProps {
  onSetupComplete: () => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onSetupComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email format (e.g., you@school.com).';
      isValid = false;
    }

    // Password validation
    if (!password || !confirmPassword) {
      newErrors.password = 'Please fill in both password fields.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.password = "Passwords don't match!";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSetupComplete();
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400">Let's get you started with UniFlow.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email-setup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            id="email-setup" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.com"
            className={`mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && <p id="email-error" className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password-setup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            id="password-setup"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className={`mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
        </div>
        <div>
          <label htmlFor="confirm-password-setup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter password again</label>
          <input 
            type="password" 
            id="confirm-password-setup" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            className={`mt-1 w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500 text-center">{errors.password}</p>
        )}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SetupView;