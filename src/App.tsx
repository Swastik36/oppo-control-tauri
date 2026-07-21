import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { GesturesView } from './components/GesturesView';
import { SettingsView } from './components/SettingsView';
import { DevToolsView } from './components/DevToolsView';
import { useEarbudStore } from './stores/useEarbudStore';
import { useTraceStore } from './stores/useTraceStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const wsRef = useRef<WebSocket | null>(null);
  const sidecarRef = useRef<any>(null);

  const { setConnected, setBattery, setEQ, setGameMode, setStatusText } = useEarbudStore();
  const { addTrace } = useTraceStore();

  const handleConnect = async () => {
    setStatusText('Connecting...');

    // 1. Try Tauri v2 Sidecar Plugin first
    try {
      const { Command } = await import('@tauri-apps/plugin-shell');
      if (sidecarRef.current) {
        await sidecarRef.current.kill();
        sidecarRef.current = null;
      }

      const command = Command.sidecar('binaries/oppoctl-cpp', [
        'stream',
        '--mac',
        '60:55:56:22:49:A0',
      ]);

      command.stdout.on('data', (line: string) => {
        handleIncomingLine(line);
      });

      const child = await command.spawn();
      sidecarRef.current = child;
      return;
    } catch {
      // Non-Tauri environment: fallback to WebSocket sidecar bridge
    }

    // 2. Fallback to WebSocket Bridge (ws://127.0.0.1:1421)
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const ws = new WebSocket('ws://127.0.0.1:1421');
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true, 'Connected (WS Bridge)');
        addTrace('[WS] Connected to oppo_ws_bridge on ws://127.0.0.1:1421');
      };

      ws.onmessage = (event) => {
        handleIncomingLine(event.data);
      };

      ws.onerror = () => {
        setConnected(false, 'WebSocket Connection Error');
      };

      ws.onclose = () => {
        setConnected(false, 'Disconnected');
      };
    } catch (err: any) {
      console.warn('WebSocket connection failed:', err);
    }
  };

  const handleIncomingLine = (line: string) => {
    addTrace(`[RX] ${line}`);
    try {
      const event = JSON.parse(line);
      if (event.type === 'status') {
        setConnected(event.state === 'connected', event.state);
      } else if (event.type === 'battery') {
        setBattery(event);
        setConnected(true, 'Connected');
      } else if (event.type === 'eq') {
        setEQ(event.preset);
      } else if (event.type === 'gamemode') {
        setGameMode(event.enabled);
      }
    } catch {
      // Non-JSON string
    }
  };

  const handleSendCommand = (cmd: object) => {
    const jsonStr = JSON.stringify(cmd);
    addTrace(`[TX] ${jsonStr}`);

    if (sidecarRef.current && sidecarRef.current.write) {
      sidecarRef.current.write(jsonStr + '\n');
    } else if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(jsonStr);
    }
  };

  useEffect(() => {
    handleConnect();
    return () => {
      if (sidecarRef.current) sidecarRef.current.kill();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#0F0F13] text-white overflow-hidden select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onConnect={handleConnect} />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardView onSendCommand={handleSendCommand} />}
        {activeTab === 'gestures' && <GesturesView onSendCommand={handleSendCommand} />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'devtools' && <DevToolsView />}
      </main>
    </div>
  );
}
