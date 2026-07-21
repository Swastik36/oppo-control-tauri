import { create } from 'zustand';

export interface TraceItem {
  id: string;
  timestamp: string;
  message: string;
}

export interface TraceState {
  traces: TraceItem[];
  enabled: boolean;
  addTrace: (msg: string) => void;
  clearTraces: () => void;
  toggleTrace: () => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  traces: [],
  enabled: true,

  addTrace: (msg) => set((state) => {
    if (!state.enabled) return state;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const newEntry: TraceItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      message: msg,
    };
    // Maintain a ring-buffer ceiling of max 300 logs for ultra performance
    const updated = [newEntry, ...state.traces].slice(0, 300);
    return { traces: updated };
  }),

  clearTraces: () => set({ traces: [] }),
  toggleTrace: () => set((state) => ({ enabled: !state.enabled })),
}));
