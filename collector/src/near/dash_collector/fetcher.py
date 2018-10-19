import requests

from near.dash_collector.service import config


class Fetcher(object):
    def __init__(self):
        self._node_api_host = config['node_api_host']
        self._node_api_port = config['node_api_port']

    def _get(self, path):
        url = "http://{}:{}/{}".format(
            self._node_api_host,
            self._node_api_port,
            path,
        )
        print(url)
        return requests.get(url)

    def get_latest_block(self):
        return self._get('get-latest-block').json()


fetcher = Fetcher()
