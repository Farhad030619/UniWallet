
import React from 'react';
import type { Deal } from '../types';

interface DealsViewProps {
  deals: Deal[];
}

const DealsView: React.FC<DealsViewProps> = ({ deals }) => {
  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Deals</h1>
        <p className="text-gray-500 dark:text-gray-400">Exclusive discounts to help you save.</p>
      </header>
      
      <div className="space-y-4">
        {deals.map(deal => (
          <div key={deal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{deal.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                    {deal.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
              </div>
              <a href={deal.link} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg font-semibold hover:bg-blue-600 transition">
                Get
              </a>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{deal.description}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Expires: {new Date(deal.expiresAt).toLocaleDateString('sv-SE')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsView;
