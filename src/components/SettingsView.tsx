import React, { useState } from 'react';
import { Cpu, Volume2, ShieldCheck } from 'lucide-react';
import { useEarbudStore } from '../stores/useEarbudStore';

export const SettingsView: React.FC = () => {
  const { isConnected, firmwareVersion } = useEarbudStore();
  const [volume, setVolume] = useState(50);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Device Settings</h2>
        <p className="text-xs text-gray-400">Firmware info & audio configuration</p>
      </div>

      {/* Firmware Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <Cpu className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Firmware Version</h3>
            <p className="text-xs text-gray-400">OPPO Enco Buds3 Pro Official</p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15">
          v{firmwareVersion}
        </span>
      </div>

      {/* Alert Sound Volume Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <Volume2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Alert Sound Volume</h3>
              <p className="text-xs text-gray-400">Prompt tone notification volume</p>
            </div>
          </div>

          <span className="text-xs font-bold text-green-400">{volume}%</span>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          value={volume}
          disabled={!isConnected}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-green-500 bg-white/10 h-2 rounded-lg cursor-pointer disabled:opacity-40"
        />
      </div>

      {/* Security Status */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-green-400" />
        <span className="text-xs text-gray-300">
          C++ LEB128 MSB Bitmask & Subtraction Bounds Guards Active
        </span>
      </div>
    </div>
  );
};
