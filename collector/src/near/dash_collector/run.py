import json
import time

from near.dash_collector import client
from near.dash_collector.sender import sender


def run_collector_loop(interval=500):
    latest_data_hash = None
    while True:
        data = client.fetch_observer_data()
        data_hash = hash(json.dumps(data))
        if data_hash != latest_data_hash:
            sender.post_latest_observer_data(data)
            latest_data_hash = data_hash

        time.sleep(interval / 1000)


if __name__ == '__main__':
    run_collector_loop()
