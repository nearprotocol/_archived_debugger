from near.dash_collector.fetcher import fetcher


def fetch_observer_data():
    return fetcher.get_observer_data()


if __name__ == '__main__':
    print(fetch_observer_data())
