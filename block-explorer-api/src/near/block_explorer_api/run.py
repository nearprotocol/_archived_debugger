from gevent.monkey import patch_all

# importing for gunicorn runner
# noinspection PyUnresolvedReferences
from near.dash_explorer_api.app import app

patch_all()
