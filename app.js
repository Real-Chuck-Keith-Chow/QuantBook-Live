import { EventEmitter } from 'events';

class MarketDataAPI extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.subscriptions = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.connected = false;
  }

  connect = () => {
    if (this.socket) {
      this.disconnect();
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
      // Resubscribe to previously subscribed symbols
      this.subscriptions.forEach(symbol => {
        this.subscribe(symbol);
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit('data', data);
        
        // Emit specific events based on data type
        if (data.type === 'tick') {
          this.emit('tick', data);
        } else if (data.type === 'order_book') {
          this.emit('orderbook', data);
        } else if (data.type === 'trade') {
          this.emit('trade', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.emit('connection', { status: 'disconnected' });
      this.handleReconnect();
    };
  };

  handleReconnect = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('connection', { status: 'failed' });
    }
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  };

  subscribe = (symbol) => {
    if (!this.connected) {
      this.connect();
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action: 'subscribe',
        symbol: symbol
      }));
      this.subscriptions.add(symbol);
      return true;
    } else {
      console.warn('WebSocket not ready, queuing subscription');
      this.subscriptions.add(symbol);
      return false;
    }
  };

  unsubscribe = (symbol) => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action: 'unsubscribe',
        symbol: symbol
      }));
      this.subscriptions.delete(symbol);
      return true;
    }
    return false;
  };

  getHistoricalData = async (symbol, timeframe = '1h', limit = 100) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${apiUrl}/history?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  };

  submitOrder = async (order) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });
      
      if (!response.ok) {
        throw new Error(`Order submission failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };
}

// Singleton instance
const api = new MarketDataAPI();

// Auto-connect when imported
if (typeof window !== 'undefined') {
  api.connect();
}

export default api;
