#!/usr/bin/env python3
from colorama import Fore, Back, Style, init
from tabulate import tabulate
import os

# Initialize colorama
init(autoreset=True)

def clear_screen():
    """Clear terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_alert(alert_type, message, color="white"):
    """Print colored alert message"""
    color_map = {
        "red": Fore.RED,
        "green": Fore.GREEN,
        "yellow": Fore.YELLOW,
        "blue": Fore.BLUE,
        "white": Fore.WHITE
    }
    print(f"{color_map.get(color, Fore.WHITE)}[{alert_type}] {message}")

def format_tick(tick_data):
    """Format tick data for display"""
    spread = tick_data['ask'] - tick_data['bid']
    spread_percent = (spread / tick_data['bid']) * 100
    
    return f"""
{Fore.CYAN}{Style.BRIGHT}{tick_data['symbol']} {Style.RESET_ALL}
{Fore.YELLOW}Price:{Style.RESET_ALL}
  {Fore.GREEN}Bid: {tick_data['bid']:,.2f}{Style.RESET_ALL}
  {Fore.RED}Ask: {tick_data['ask']:,.2f}{Style.RESET_ALL}
  Spread: {spread:,.2f} ({spread_percent:.2f}%)

{Fore.YELLOW}Volume:{Style.RESET_ALL} {tick_data.get('volume', 'N/A')}
{Fore.YELLOW}Timestamp:{Style.RESET_ALL} {tick_data['timestamp']}
"""

def format_order_book(book_data, depth=5):
    """Format order book data as a table"""
    bids = sorted(
        [(p, q) for p, q in book_data['bids'].items()],
        key=lambda x: float(x[0]),
        reverse=True
    )[:depth]

    asks = sorted(
        [(p, q) for p, q in book_data['asks'].items()],
        key=lambda x: float(x[0])
    )[:depth]

    book_table = []
    for i in range(max(len(bids), len(asks))):
        bid = bids[i] if i < len(bids) else ("", "")
        ask = asks[i] if i < len(asks) else ("", "")
        book_table.append([
            f"{Fore.GREEN}{bid[0]}{Style.RESET_ALL}",
            bid[1],
            f"{Fore.RED}{ask[0]}{Style.RESET_ALL}",
            ask[1]
        ])

    return tabulate(
        book_table,
        headers=[
            f"{Fore.GREEN}Bid Price{Style.RESET_ALL}",
            "Bid Size",
            f"{Fore.RED}Ask Price{Style.RESET_ALL}",
            "Ask Size"
        ],
        tablefmt="simple_outline"
    )

def format_trade_confirmation(side, symbol, quantity, price):
    """Format trade execution confirmation"""
    color = Fore.GREEN if side.lower() == 'buy' else Fore.RED
    return f"""
{color}{Style.BRIGHT}Trade Executed{Style.RESET_ALL}
{Style.BRIGHT}{symbol}{Style.RESET_ALL} {side.upper()}
Quantity: {quantity}
Price: {price:,.2f}
"""
