/**
 * useWebSocket - tiny React hook for resilient WS connections.
 * Default URL: `${protocol}://${host}/ws/depth` (ws/wss based on page protocol).
 *
 * Features:
 * - Auto-reconnect with exponential backoff (cap 10s)
 * - Heartbeat ping to keep idle connections alive
 * - Exposes: readyState, readyLabel, lastMessage, messages[], send()
 */

import { useEffect, useRef, useState, useCallback } from "react";

const READY_LABEL = { 0: "CONNECTING", 1: "OPEN", 2: "CLOSING", 3: "CLOSED" };

export default function useWebSocket(url) {
  const [readyState, setReadyState] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const heartbeatRef = useRef(null);

  const connect = useCallback(() => {
    const resolvedUrl =
      url ||
      (() => {
        const proto = window.location.protocol === "https:" ? "wss" : "ws";
        return `${proto}://${window.location.host}/ws/depth`;
      })();

    const ws = new WebSocket(resolvedUrl);
    wsRef.current = ws;
    setReadyState(ws.readyState);

    ws.onopen = () => {
      retryRef.current = 0;
      setReadyState(ws.readyState);
      // heartbeat every 15s
      heartbeatRef.current = setInterval(() => {
        try {
          ws.send(JSON.stringify({ type: "ping", t: Date.now() }));
        } catch {
          /* no-op */
        }
