import { useEffect, useState } from "react";

export default function MarketChart() {
  const [ob, setOb] = useState({ symbol: "FAKE", bids: [], asks: [] });

  useEffect(() => {
    const port = import.meta.env.VITE_WS_PORT || 8080;
    const ws = new WebSocket(`ws://localhost:${port}/ws/depth`);
    ws.onmessage = (e) => setOb(JSON.parse(e.data));
    return () => ws.close();
  }, []);

  const topBid = ob.bids?.[0], topAsk = ob.asks?.[0];
  return (
    <div style={{padding:16}}>
      <h2>Top of Book — {ob.symbol}</h2>
      <div>Bid: {topBid ? `${topBid.price.toFixed(2)} x ${topBid.size.toFixed(2)}` : "-"}</div>
      <div>Ask: {topAsk ? `${topAsk.price.toFixed(2)} x ${topAsk.size.toFixed(2)}` : "-"}</div>
    </div>
  );
}
