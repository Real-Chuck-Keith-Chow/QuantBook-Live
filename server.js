const WebSocket = require('ws');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Setup gRPC client
const packageDefinition = protoLoader.loadSync('../market-data-generator/protos/market_data.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);
const client = new proto.MarketDataService(
  'market-data-generator:50051',
  grpc.credentials.createInsecure()
);

// WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  const stream = client.StreamMarketData({ symbols: ['AAPL', 'GOOG'] });
  
  stream.on('data', (update) => {
    ws.send(JSON.stringify(update));
  });
  
  ws.on('close', () => stream.destroy());
});
