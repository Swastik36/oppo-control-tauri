import React from 'react';

interface SilhouetteProps {
  type: 'left' | 'right' | 'case';
  connected: boolean;
  charging: boolean;
  battery: number;
}

export const Silhouette: React.FC<SilhouetteProps> = ({ type, connected, charging, battery }) => {
  const getBatteryColor = () => {
    if (!connected) return '#4B5563';
    if (battery <= 20) return '#F97316'; // Orange
    return '#22C55E'; // Green
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 relative">
      <svg
        viewBox="0 0 44 60"
        className={`w-16 h-20 transition-all duration-300 ${
          connected ? 'opacity-100 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'opacity-30'
        }`}
      >
        {type === 'left' || type === 'right' ? (
          <>
            {/* Earbud Stem & Head Shape */}
            <path
              d="M 22,4 C 30,4 35,10 35,18 C 35,24 31,28 31,33 L 31,48 C 31,54 26,58 22,58 C 18,58 13,54 13,48 L 13,33 C 13,28 9,24 9,18 C 9,10 14,4 22,4 Z"
              fill="#F3F4F6"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
            {/* Inner Earpiece Oval */}
            <ellipse cx="22" cy="16" rx="7" ry="9" fill={getBatteryColor()} opacity="0.8" />
          </>
        ) : (
          <>
            {/* Charging Case Body */}
            <rect x="6" y="16" width="32" height="40" rx="12" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
            {/* Top Hinge Lid Line */}
            <line x1="6" y1="32" x2="38" y2="32" stroke="#9CA3AF" strokeWidth="1.5" />
            {/* Center Status LED */}
            <circle cx="22" cy="42" r="3" fill={getBatteryColor()} />
          </>
        )}
      </svg>

      {/* Charging Lightning Badge */}
      {charging && connected && (
        <span className="absolute top-1 right-1 text-xs font-bold text-green-400 animate-pulse bg-green-950/80 px-1.5 py-0.5 rounded-full border border-green-500/40">
          ⚡
        </span>
      )}
    </div>
  );
};
