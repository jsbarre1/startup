import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedMessage() {
  const navigate= useNavigate()
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-center text-gray-600 mb-6">
          You are not authorized to view this page. Please log in or contact an administrator for assistance.
        </p>
        <div className="flex justify-center">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/')}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}