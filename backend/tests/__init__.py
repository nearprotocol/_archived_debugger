import fakeredis

from near.dash_backend.service import service


def setup():
    redis_client = fakeredis.FakeStrictRedis()
    service.configure(redis_client=redis_client)
