import React from 'react';
import { useEarbudStore } from '../stores/useEarbudStore';
import { Silhouette } from './Silhouette';
import { Sliders, Gamepad2 } from 'lucide-react';

interface DashboardViewProps {
  onSendCommand: (cmd: object) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSendCommand }) => {
  const {
    isConnected,
    leftBattery,
    leftCharging,
    rightBattery,
    rightCharging,
    caseBattery,
    caseCharging,
    currentEQ,
    gameMode,
  } = useEarbudStore();

  const handleSetEQ = (preset: number) => {
    onSendCommand({ action: 'set_eq', preset });
  };

  const handleToggleGameMode = (enable: boolean) => {
    onSendCommand({ action: 'set_gamemode', enable });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">OPPO Enco Buds3 Pro</h2>
        <p className="text-xs text-gray-400">Real-time Bluetooth telemetry & control facade</p>
      </div>

      {/* Hero Glassmorphic Battery Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-2xl">
        <div className="grid grid-cols-3 gap-4">
          {/* Left Bud */}
          <div className="flex flex-col items-center">
            <Silhouette type="left" connected={isConnected} charging={leftCharging} battery={leftBattery} />
            <span className="text-[11px] font-bold text-gray-400 mt-1">LEFT</span>
            <span className="text-xl font-extrabold text-green-400">
              {isConnected ? `${leftBattery}%` : '--'}
            </span>
          </div>

          {/* Right Bud */}
          <div className="flex flex-col items-center">
            <Silhouette type="right" connected={isConnected} charging={rightCharging} battery={rightBattery} />
            <span className="text-[11px] font-bold text-gray-400 mt-1">RIGHT</span>
            <span className="text-xl font-extrabold text-green-400">
              {isConnected ? `${rightBattery}%` : '--'}
            </span>
          </div>

          {/* Case */}
          <div className="flex flex-col items-center">
            <Silhouette type="case" connected={isConnected && caseBattery >= 0} charging={caseCharging} battery={caseBattery} />
            <span className="text-[11px] font-bold text-gray-400 mt-1">CASE</span>
            <span className="text-xl font-extrabold text-white">
              {isConnected && caseBattery >= 0 ? `${caseBattery}%` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Sound Master Equalizer Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-green-400" />
          <h3 className="text-base font-bold text-white">Sound Master EQ</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 0, label: 'Original Sound' },
            { id: 1, label: 'Clear Vocals' },
            { id: 2, label: 'Bass Boost' },
          ].map((preset) => {
            const active = currentEQ === preset.id;
            return (
              <button
                key={preset.id}
                disabled={!isConnected}
                onClick={() => handleSetEQ(preset.id)}
                className={`py-3 px-4 rounded-2xl font-medium text-xs transition-all border ${
                  active
                    ? 'bg-green-500 text-black font-bold border-green-400 shadow-lg shadow-green-500/20'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                } ${!isConnected && 'opacity-40 cursor-not-allowed'}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Low-Latency Game Mode Switch Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <Gamepad2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Low-Latency Game Mode</h3>
            <p className="text-xs text-gray-400">Reduces wireless audio latency during gaming</p>
          </div>
        </div>

        <button
          disabled={!isConnected}
          onClick={() => handleToggleGameMode(!gameMode)}
          className={`w-12 h-6 rounded-full transition-colors relative border ${
            gameMode ? 'bg-green-500 border-green-400' : 'bg-white/10 border-white/20'
          } ${!isConnected && 'opacity-40 cursor-not-allowed'}`}
        >
          <span
            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              gameMode ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
