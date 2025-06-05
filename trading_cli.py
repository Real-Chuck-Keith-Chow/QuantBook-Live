import click
import websockets
import asyncio

@click.group()
def cli():
    pass

@cli.command()
@click.argument('symbol')
def subscribe(symbol):
    async def receive_updates():
        async with websockets.connect('ws://localhost:8080') as ws:
            while True:
                update = await ws.recv()
                print(f"\n{update}\n> ", end="")
    
    asyncio.get_event_loop().run_until_complete(receive_updates())

if __name__ == '__main__':
    cli()
