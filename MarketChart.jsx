import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

export default function MarketChart({ symbol }) {
  const [dataPoints, setDataPoints] = useState([]);
  const ws = new WebSocket('ws://api-gateway:8080');

  useEffect(() => {
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.symbol === symbol) {
        setDataPoints(prev => [...prev.slice(-99), update]);
      }
    };
    return () => ws.close();
  }, [symbol]);

  return <Line data={{
    labels: dataPoints.map((_, i) => i),
    datasets: [{
      label: `${symbol} Price`,
      data: dataPoints.map(p => (p.bid + p.ask)/2)
    }]
  }} />;
}
