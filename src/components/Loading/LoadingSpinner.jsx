// import React from 'react';
// import { MoonLoader } from 'react-spinners';

// const LoadingSpinner = () => {
//    return (
//     <div>
      
//       <MoonLoader></MoonLoader>

//     </div>
//   );
// };

// export default LoadingSpinner;
import React from 'react';
import { MoonLoader } from 'react-spinners';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      {/* Wrapper for the Spinner and Brand */}
      <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
        
        {/* The Spinner with Brand Color */}
        <div className="relative flex items-center justify-center">
          <MoonLoader 
            color="#0d9488" // Teal-600 to match your theme
            size={60} 
            speedMultiplier={0.8}
          />
          {/* Optional: Small logo or dot in the center */}
          <div className="absolute w-2 h-2 bg-teal-600 rounded-full shadow-[0_0_15px_rgba(13,148,136,0.6)]"></div>
        </div>

        {/* Brand & Loading Text */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-slate-800 uppercase">
            Style<span className="text-teal-600">Decor</span>
          </h2>
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
              Designing your space
            </span>
          </div>
        </div>

        {/* Progress Bar (Purely Visual/Animation) */}
        <div className="w-32 md:w-48 h-0.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-teal-600 origin-left animate-loading-bar"></div>
        </div>
      </div>

      {/* Tailwind Custom Animation (Inline Style for simplicity) */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); opacity: 0; }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;