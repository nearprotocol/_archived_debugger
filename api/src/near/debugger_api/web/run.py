from gevent.monkey import patch_all

patch_all()

import logging
import os
import sys
import threading
import time

from near.debugger_api.api import DebuggerApi
from near.debugger_api.web.app import create_app

db_uri = os.environ.get('NEAR_DEBUGGER_DB_URI', 'sqlite:////tmp/debugger-api.db')
server_address = os.environ.get('NEAR_DEBUGGER_SERVER_ADDRESS', 'http://localhost')
application, db_session_getter, db_session_setter = create_app()
application.api = DebuggerApi(
    server_address=server_address,
    db_uri=db_uri,
    thread_local_db_session_getter=db_session_getter,
    thread_local_db_session_setter=db_session_setter,
)

api = DebuggerApi(server_address=server_address, db_uri=db_uri)
with api.db.transaction_context():
    api.db.create_all()

api.db.session.remove()


class BlockImportThread(threading.Thread):
    @classmethod
    def run(cls):
        while True:
            try:
                api.import_beacon_blocks()
            except Exception as e:
                logging.exception(str(e), exc_info=sys.exc_info())
            finally:
                api.db.session.remove()

            time.sleep(10)


block_import_thread = BlockImportThread()
block_import_thread.start()

if __name__ == '__main__':
    application.run(host='0.0.0.0', port=5000, debug=True)
