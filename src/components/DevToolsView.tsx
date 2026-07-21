import React, { useState } from 'react';
import { Trash2, Power, Copy, Check } from 'lucide-react';
import { useTraceStore } from '../stores/useTraceStore';

export const DevToolsView: React.FC = () => {
  const { traces, enabled, clearTraces, toggleTrace } = useTraceStore();
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = traces.map((t) => `[${t.timestamp}] ${t.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Developer Diagnostics</h2>
          <p className="text-xs text-gray-400">Real-time C++ NDJSON streaming packet log</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTrace}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              enabled
                ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {enabled ? 'Tracing ON' : 'Tracing OFF'}
          </button>

          <button
            disabled={traces.length === 0}
            onClick={handleCopyLogs}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              copied
                ? 'bg-green-500 text-black border-green-400'
                : 'bg-white/10 border-white/15 text-gray-300 hover:bg-white/20'
            } ${traces.length === 0 && 'opacity-40 cursor-not-allowed'}`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy All Logs'}
          </button>

          <button
            onClick={clearTraces}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-gray-300 hover:bg-white/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Copyable Ring-Buffer Trace Console */}
      <div className="flex-1 bg-black/80 border border-white/15 rounded-2xl p-4 font-mono text-xs text-green-400 overflow-y-auto space-y-1.5 shadow-inner select-text cursor-text">
        {traces.length === 0 ? (
          <div className="text-gray-500 italic text-center py-10 select-none">
            No trace logs recorded. Streaming activity will appear here...
          </div>
        ) : (
          traces.map((trace) => (
            <div key={trace.id} className="leading-relaxed break-all border-b border-white/5 pb-1 select-text">
              <span className="text-gray-500 select-none">[{trace.timestamp}]</span> {trace.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
