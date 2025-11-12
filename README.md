# 📈 QuantBook-Live  
**Enterprise-Grade Market Data Simulator | HFT-Ready Architecture**  
> Real-time financial market simulator with gRPC streaming, microservices architecture, and live order-book visualization.

---

[![CI](https://github.com/Real-Chuck-Keith-Chow/QuantBook-Live/actions/workflows/ci.yml/badge.svg)](https://github.com/Real-Chuck-Keith-Chow/QuantBook-Live/actions)
[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![gRPC](https://img.shields.io/badge/API-gRPC-0080FF?logo=googlecloud&logoColor=white)](https://grpc.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build with ❤️](https://img.shields.io/badge/Built_with-❤️_by_Keith_Chow-critical)](https://github.com/Real-Chuck-Keith-Chow)

---

## 🌟 Overview

**QuantBook-Live** is a full-stack **real-time market simulator** built for quant developers, algo traders, and systems engineers who want to experiment with *high-frequency trading (HFT)* style infrastructure without paying for premium data feeds.

It models a complete **exchange-grade architecture** — from synthetic tick generation to gRPC/WS streaming and TimescaleDB persistence — giving you a modular playground to prototype trading engines, analytics dashboards, or fault-tolerant microservices.

---

## ⚡ Key Features

| Category | Highlights |
|-----------|-------------|
| 🧩 **Real-Time Order Book Simulation** | NYSE/Nasdaq-style price ladder with configurable depth (10/20/50 levels) |
| 🔌 **Protocol Flexibility** | gRPC (primary) + WebSocket fallback with live snapshot + delta updates |
| 💥 **Fault Injection** | Simulate latency (50 µs – 500 ms) and packet loss to stress-test strategies |
| 🧠 **Microservices-Ready** | Decoupled data generator, API gateway, and persistence layer |
| 📊 **Professional Dashboard** | React-based visualization with depth chart, spread analyzer, and volume heatmap |
| 🪶 **Lightweight Deployment** | Runs via Docker Compose or a single `make run-server` command |

---

## 🏗 Architecture

      ┌────────────────────────────┐
      │      Market Generator      │
      │  • Synthetic tick feed     │
      │  • Latency / loss injection│
      └────────────┬───────────────┘
                   │  gRPC stream
      ┌────────────▼───────────────┐
      │        API Gateway         │
      │  • gRPC + WebSocket bridge │
      │  • Snapshot + delta model  │
      └────────────┬───────────────┘
                   │  async I/O
      ┌────────────▼───────────────┐
      │       TimescaleDB          │
      │  • Tick & orderbook store  │
      │  • Time-series queries     │
      └────────────┬───────────────┘
                   │  REST / WS feed
      ┌────────────▼───────────────┐
      │      React Dashboard       │
      │  • Depth chart             │
      │  • Spread analyzer         │
      │  • Volume heatmap          │
      └────────────────────────────┘

---

## 🧰 Quick Start

### 1️⃣ Clone & Setup
```bash
git clone https://github.com/Real-Chuck-Keith-Chow/QuantBook-Live.git
cd QuantBook-Live
make setup

2️⃣ Generate Proto Stubs
make proto

3️⃣ Launch the Server
make run-server

4️⃣ (Optional) Run in Docker
docker compose up -d

⚙️ Environment Variables

Copy .env.example → .env and edit values:

cp .env.example .env

Variable	Description
DB_HOST	PostgreSQL/Timescale host
DB_PORT	Database port
GRPC_PORT	gRPC server port
WS_PORT	WebSocket port
SYMBOLS	Comma-separated list of symbols to simulate
BOOK_DEPTH	Order-book depth levels
TICK_INTERVAL_MS	Tick generation frequency
🧪 Testing & Linting
make lint     # Run ruff + mypy checks
make test     # Execute pytest suite

🐋 Docker Compose

Spin up everything (DB + gateway + generator + UI):

docker compose up --build


Then visit http://localhost:5173
 for the React dashboard.

💻 Tech Stack
Layer	Technology
Backend	Python 3.11 · gRPC · AsyncIO · SQLAlchemy
Frontend	React · Vite · WebSocket client
Database	TimescaleDB (PostgreSQL 16 extension)
DevOps	Docker · Make · GitHub Actions CI
Tools	Ruff · Mypy · Pytest · Rich · Dotenv
🛠 Roadmap

 Add real-exchange replay mode (NASDAQ TotalView ITCH parser)

 Integrate AI-based anomaly detection for liquidity shocks

 Deploy hosted demo dashboard

 Add FIX bridge for external trading bots

🧑‍💻 Author

Cheuk Fung Keith Chow
📍 Toronto, Canada
🌐 GitHub @Real-Chuck-Keith-Chow

📜 License

This project is licensed under the MIT License
 — free for personal and commercial use.

⭐ If this project sparks your interest, give it a star and contribute!
Let’s build the future of open-source quant simulation together ⚙️💸

make run-server

docker compose up -d

docker compose up -d


🧑‍💻 Author

Cheuk Fung Keith Chow
📍 Toronto, Canada
🌐 GitHub @Real-Chuck-Keith-Chow

📜 License

This project is licensed under the MIT License
 — free for personal and commercial use.
