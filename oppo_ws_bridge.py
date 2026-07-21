#!/usr/bin/env python3
import asyncio
import os
import sys
import subprocess
import json
import websockets

CPP_CLI_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "oppo-control-cpp", "oppoctl-cpp")
PORT = 1421

CLIENTS = set()

async def sidecar_stdout_reader(proc):
    while True:
        line = await proc.stdout.readline()
        if not line:
            break
        text = line.decode('utf-8').strip()
        if text and CLIENTS:
            await asyncio.gather(*[client.send(text) for client in CLIENTS if client.open], return_exceptions=True)

async def handle_client(websocket, proc):
    CLIENTS.add(websocket)
    try:
        async for message in websocket:
            if proc.poll() is None:
                proc.stdin.write((message + "\n").encode('utf-8'))
                await proc.stdin.drain()
    except Exception:
        pass
    finally:
        CLIENTS.remove(websocket)

async def main():
    mac = "60:55:56:22:49:A0"
    if len(sys.argv) > 1:
        mac = sys.argv[1]

    cmd = [CPP_CLI_PATH, "--mac", mac, "stream"]
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    asyncio.create_task(sidecar_stdout_reader(proc))

    async with websockets.serve(lambda ws: handle_client(ws, proc), "127.0.0.1", PORT):
        print(f"[+] WebSocket Bridge active on ws://127.0.0.1:{PORT} for oppoctl-cpp stream engine.")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
