import json
import time

from near.dash_collector import client
from near.dash_collector.sender import sender


def run_collector_loop(interval=500):
    last_fetch_hash = None
    while True:
        latest_block = client.fetch_latest_block()
        fetch_hash = hash(json.dumps(latest_block))
        if fetch_hash != last_fetch_hash:
            sender.post_latest_block(latest_block)
            last_fetch_hash = fetch_hash

        time.sleep(interval / 1000)


if __name__ == '__main__':
    run_collector_loop()
