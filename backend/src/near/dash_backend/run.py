from gevent.monkey import patch_all

from near.dash_backend.app import (
    app,
    socket_io_wrapper,
)
from near.dash_backend.service import service

if __name__ == '__main__':
    patch_all()

    service.configure()
    socket_io_wrapper.run(app, host='0.0.0.0')
