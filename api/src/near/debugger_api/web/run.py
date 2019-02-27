from gevent.monkey import patch_all

patch_all()

import os
import sys
import threading
import time

from near.debugger_api.api import DebuggerApi
from near.debugger_api.web.app import create_app

if __name__ == '__main__':
    db_uri = os.environ.get('NEAR_DEBUGGER_DB_URI', 'sqlite:////tmp/debugger-api.db')
    app, db_session_getter, db_session_setter = create_app()
    app.api = DebuggerApi(
        thread_local_db_session_getter=db_session_getter,
        thread_local_db_session_setter=db_session_setter,
    )

    api = DebuggerApi()
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
                    print(e, file=sys.stderr)
                finally:
                    api.db.session.remove()

                time.sleep(10)


    block_import_thread = BlockImportThread()
    block_import_thread.start()

    app.run(host='0.0.0.0', port=5000)
