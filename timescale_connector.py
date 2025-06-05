import psycopg2
from config import DB_CONFIG

class TimescaleConnector:
    def __init__(self):
        self.conn = psycopg2.connect(**DB_CONFIG)
        self._create_hypertable()
    
    def _create_hypertable(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS market_data (
                    time TIMESTAMPTZ NOT NULL,
                    symbol VARCHAR(10) NOT NULL,
                    bid NUMERIC,
                    ask NUMERIC
                );
                SELECT create_hypertable('market_data', 'time');
            """)
            self.conn.commit()
    
    def insert_tick(self, tick):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO market_data (time, symbol, bid, ask)
                VALUES (%s, %s, %s, %s)
            """, (tick['timestamp'], tick['symbol'], tick['bid'], tick['ask']))
            self.conn.commit()
