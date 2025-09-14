// server.js
require("dotenv").config({ path: "config/dev.env" });

const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const WebSocket = require("ws");

const PROTO_PATH = path.join(__dirname, "protos", "market_data.proto");
const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const proto = grpc.loadPackageDefinition(pkgDef).quantbook;

const GRPC_PORT = process.env.GRPC_PORT || 50051;
const WS_PORT   = process.env.WS_PORT   || 8080;

const client = new proto.MarketData(
  `localhost:${GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

const wss = new WebSocket.Server({ port: WS_PORT, path: "/ws/depth" });
wss.on("connection", (ws) => {
  const call = client.StreamOrderBook({ symbol: "FAKE", depth: 10 });
  call.on("data", (u) => ws.send(JSON.stringify(u)));
  call.on("error", (e) => ws.close(1011, e.message));
  call.on("end",   () => ws.close());
  ws.on("close",   () => call.cancel());
});

console.log(`✅ WS gateway: ws://localhost:${WS_PORT}/ws/depth (→ gRPC :${GRPC_PORT})`);
