import React from 'react';

const ImageFallback = ({ className = '', text = 'Lil\' Threadz' }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant font-headline-md italic ${className}`}>
      <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">
        texture
      </span>
      <span className="text-sm font-semibold tracking-wider font-label-md uppercase opacity-60">
        {text}
      </span>
    </div>
  );
};

export default ImageFallback;
