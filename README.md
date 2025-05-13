# 📈 QuantBook-Live 
**Enterprise-Grade Market Data Simulator | HFT-Ready Architecture**  
*Real-time financial market simulator with gRPC streaming, microservices architecture, and live order book visualization*

[![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)](https://python.org)
[![gRPC](https://img.shields.io/badge/gRPC-1.42+-brightgreen?logo=grpc)](https://grpc.io)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-Apache_2.0-red.svg)](https://opensource.org/licenses/Apache-2.0)

![QuantBook Live Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDk5d2V6YjV1ZGJmY3BqY2VjZ3FhbmR4Z2x6eWY0bHZtY2R6eWZ5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/your-demo-gif-here.gif)

## 🌟 Key Features
- **Real-time Order Book Simulation**  
  NYSE/Nasdaq-style price ladder with configurable depth (10/20/50 levels)
- **Protocol Flexibility**  
  gRPC (primary) + WebSocket fallback with snapshot+delta updates
- **Fault Injection**  
  Simulate network latency (50μs-500ms) and packet loss
- **Microservices Ready**  
  Decoupled data generator, API gateway, persistence layer
- **Professional Dashboard**  
  React-based visualization with:
  - Depth chart
  - Spread analyzer
  - Volume heatmap

## 🏗 Architecture
```mermaid
graph LR
    A[Market Data Generator] -->|gRPC Stream| B(API Gateway)
    B --> C[React Dashboard]
    B --> D[CLI Trading Client]
    B --> E[Persistence Service]
    E --> F[(TimescaleDB)]
    A --> G[FIX Simulator]
