import os

import redis


class Service(object):
    def __init__(self):
        self._configured = False
        self.redis = None

    def configure(self, redis_client=None):
        if not self._configured:
            if redis_client is None:
                redis_host = os.environ.get(
                    'NEAR_COLLECTOR_SERVER_REDIS_HOST',
                    'localhost',
                )
                redis_client = redis.StrictRedis(host=redis_host)
            self.redis = redis_client
            self._configured = True


service = Service()
