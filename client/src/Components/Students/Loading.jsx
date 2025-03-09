import React from 'react';

export const Loading = () => {
  return (
    <div className="flex flex-wrap  p-4">
      {[...Array(24)].map((_, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
          <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};

// <div
// >
    
// </div>