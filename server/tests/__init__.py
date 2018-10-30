import fakeredis

from near.dash_server.service import service


def setup():
    redis_client = fakeredis.FakeStrictRedis()
    service.configure(redis_client=redis_client)
