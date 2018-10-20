import json
import time

from near.dash_collector import client
from near.dash_collector.sender import sender


def run_collector_loop(interval=500):
    latest_context_hash = None
    while True:
        context = client.fetch_context()
        context_hash = hash(json.dumps(context))
        if context_hash != latest_context_hash:
            sender.post_latest_context(context)
            latest_context_hash = context_hash

        time.sleep(interval / 1000)


if __name__ == '__main__':
    run_collector_loop()
