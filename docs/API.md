# API Overview

## gRPC (primary)
- Service: MarketData
- RPC: StreamOrderBook(MarketDataRequest) -> stream OrderBookUpdate
- Message: MarketDataRequest { symbol, depth }
- Message: OrderBookUpdate { symbol, ts_unix_ms, bids[], asks[] }
- Message: PriceLevel { price, size }

## WebSocket (bridge)
- Endpoint: /ws/depth
- Messages: JSON snapshots/deltas with bids/asks arrays

## REST (if gateway implemented)
- GET /api/history?symbol=SYMB&timeframe=1h&limit=100
- POST /api/orders { side, symbol, quantity, price, type }
