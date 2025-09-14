import os, time, random, asyncio
from grpc import aio
import grpc

# import generated code
from .gen import market_data_pb2 as pb
from .gen import market_data_pb2_grpc as rpc

class MarketDataService(rpc.MarketDataServicer):
    async def StreamOrderBook(self, request, context):
        symbol = request.symbol or "FAKE"
        depth  = request.depth or 10
        mid    = 100.0
        while True:
            mid += random.uniform(-0.02, 0.02)
            bids, asks = [], []
            for i in range(depth):
                step = 0.01 * (i + 1)
                bids.append(pb.PriceLevel(price=mid - step, size=random.uniform(0.1, 2.0)))
                asks.append(pb.PriceLevel(price=mid + step, size=random.uniform(0.1, 2.0)))
            yield pb.OrderBookUpdate(
                symbol=symbol,
                ts_unix_ms=int(time.time() * 1000),
                bids=bids, asks=asks,
            )
            await asyncio.sleep(0.1)  # 10 Hz

async def main():
    port = int(os.getenv("GRPC_PORT", "50051"))
    server = aio.server()
    rpc.add_MarketDataServicer_to_server(MarketDataService(), server)
    server.add_insecure_port(f"[::]:{port}")
    await server.start()
    print(f"✅ gRPC MarketData listening on {port}")
    await server.wait_for_termination()

if __name__ == "__main__":
    asyncio.run(main())
