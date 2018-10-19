import json

import requests
from near.dash_collector.service import config


class Sender(object):
    def __init__(self):
        self._server_api_host = config['server_api_host']
        self._server_api_port = config['server_api_port']

    def _post(self, path, data):
        url = "http://{}:{}/{}".format(
            self._server_api_host,
            self._server_api_port,
            path,
        )
        # SocketIO seems to break standard the Flask JSON interface
        return requests.post(
            url,
            json.dumps(data),
            headers={'content-type': 'application/json'},
        )

    def post_latest_block(self, data):
        response = self._post('submit-latest-block', data)
        assert response.status_code == 200
        return response.json()


sender = Sender()
