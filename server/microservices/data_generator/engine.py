# server/microservices/data_generator/engine.py
import random
import time

class OrderBookEngine:
    """
    Simple random-walk midprice + symmetric depth ladder.
    Keep it pure so gRPC layer can stay thin.
    """
    def __init__(self, mid=100.0, tick=0.01, drift=0.0, vol=0.02):
        self.mid = mid
        self.tick = tick
        self.drift = drift
        self.vol = vol

    def step(self, *, symbol: str = "FAKE", depth: int = 10):
        # random walk for the mid
        self.mid += self.drift + random.uniform(-self.vol, self.vol)

        bids, asks = [], []
        for i in range(depth):
            d = self.tick * (i + 1)
            bids.append((self.mid - d, max(0.01, random.uniform(0.1, 2.0))))
            asks.append((self.mid + d, max(0.01, random.uniform(0.1, 2.0))))

        return {
            "symbol": symbol,
            "ts_unix_ms": int(time.time() * 1000),
            "bids": bids,   # list[(price, size)]
            "asks": asks,   # list[(price, size)]
        }

