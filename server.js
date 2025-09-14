// client/src/MarketChart.jsx
import { useEffect, useState } from "react";

export default function MarketChart() {
  const [ob, setOb] = useState({ symbol: "FAKE", bids: [], asks: [] });

  useEffect(() => {
    const port = import.meta.env.VITE_WS_PORT || 8080;
    const ws = new WebSocket(`ws://localhost:${port}/ws/depth`);
    ws.onmessage = (e) => setOb(JSON.parse(e.data));
    return () => ws.close();
  }, []);

  const b = ob.bids?.[0], a = ob.asks?.[0];
  return (
    <div style={{ padding: 16 }}>
      <h2>Top of Book — {ob.symbol}</h2>
      <div>Bid: {b ? `${b.price.toFixed(2)} x ${b.size.toFixed(2)}` : "-"}</div>
      <div>Ask: {a ? `${a.price.toFixed(2)} x ${a.size.toFixed(2)}` : "-"}</div>
    </div>
  );
}
