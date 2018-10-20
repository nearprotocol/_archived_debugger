from near.dash_collector.fetcher import fetcher


def fetch_context():
    return fetcher.get_context()


if __name__ == '__main__':
    print(fetch_context())
