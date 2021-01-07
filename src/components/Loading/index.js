import React from 'react';

const Loading = ({ size = 2 }) => {
  const dotClasses = `h-${size} w-${size} bg-gray-400 rounded-full animate-pulse`;

  return (
    <div className="flex justify-center py-2 loading-wrapper">
      <div className={dotClasses} />
      <div className={`${dotClasses} mx-2`} />
      <div className={dotClasses} />
    </div>
  );
};

export default Loading;
