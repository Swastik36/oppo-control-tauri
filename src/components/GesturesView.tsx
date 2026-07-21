import React from 'react';
import { Hand, RefreshCw } from 'lucide-react';
import { useEarbudStore } from '../stores/useEarbudStore';

interface GesturesViewProps {
  onSendCommand: (cmd: object) => void;
}

export const GesturesView: React.FC<GesturesViewProps> = ({ onSendCommand }) => {
  const { isConnected } = useEarbudStore();

  const gestures = [
    { ear: 'Left', trigger: 'Double Tap', func: 'Next Track' },
    { ear: 'Left', trigger: 'Triple Tap', func: 'Previous Track' },
    { ear: 'Left', trigger: 'Long Press', func: 'Game Mode Toggle' },
    { ear: 'Right', trigger: 'Double Tap', func: 'Play / Pause' },
    { ear: 'Right', trigger: 'Triple Tap', func: 'Next Track' },
    { ear: 'Right', trigger: 'Long Press', func: 'Voice Assistant' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Touch Controls</h2>
          <p className="text-xs text-gray-400">Configure earbud touch gesture triggers</p>
        </div>

        <button
          disabled={!isConnected}
          onClick={() => onSendCommand({ action: 'get_gestures' })}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-gray-300 hover:bg-white/20 transition-all ${
            !isConnected && 'opacity-40 cursor-not-allowed'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {gestures.map((g, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Hand className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-300">{g.ear} Earbud</span>
                <p className="text-sm font-semibold text-white">{g.trigger}</p>
              </div>
            </div>

            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              {g.func}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
