import { create } from 'zustand';

export interface EarbudState {
  isConnected: boolean;
  statusText: string;
  leftBattery: number;
  leftCharging: boolean;
  rightBattery: number;
  rightCharging: boolean;
  caseBattery: number;
  caseCharging: boolean;
  currentEQ: number;
  gameMode: boolean;
  firmwareVersion: string;

  setConnected: (connected: boolean, status?: string) => void;
  setBattery: (data: {
    left: number;
    left_charging: boolean;
    right: number;
    right_charging: boolean;
    case: number;
    case_charging: boolean;
  }) => void;
  setEQ: (preset: number) => void;
  setGameMode: (enabled: boolean) => void;
  setStatusText: (status: string) => void;
  setFirmware: (version: string) => void;
}

export const useEarbudStore = create<EarbudState>((set) => ({
  isConnected: false,
  statusText: 'Disconnected',
  leftBattery: 0,
  leftCharging: false,
  rightBattery: 0,
  rightCharging: false,
  caseBattery: -1,
  caseCharging: false,
  currentEQ: 0,
  gameMode: false,
  firmwareVersion: '1.0.0',

  setConnected: (connected, status) => set({
    isConnected: connected,
    statusText: status || (connected ? 'Connected' : 'Disconnected'),
  }),

  setBattery: (data) => set({
    leftBattery: data.left,
    leftCharging: data.left_charging,
    rightBattery: data.right,
    rightCharging: data.right_charging,
    caseBattery: data.case,
    caseCharging: data.case_charging,
  }),

  setEQ: (preset) => set({ currentEQ: preset }),
  setGameMode: (enabled) => set({ gameMode: enabled }),
  setStatusText: (status) => set({ statusText: status }),
  setFirmware: (version) => set({ firmwareVersion: version }),
}));
