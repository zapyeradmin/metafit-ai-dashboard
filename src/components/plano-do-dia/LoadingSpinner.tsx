
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
