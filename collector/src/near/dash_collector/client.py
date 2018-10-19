from near.dash_collector.fetcher import fetcher


def fetch_latest_block():
    return fetcher.get_latest_block()


if __name__ == '__main__':
    print(fetch_latest_block())
