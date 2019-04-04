import logging
import os
import sys
import threading
import time

from near.debugger_api.api import DebuggerApi


def get_db_uri():
    return os.environ.get('NEAR_DEBUGGER_DB_URI', 'sqlite:////tmp/debugger-api.db')


def get_server_address():
    return os.environ.get('NEAR_DEBUGGER_SERVER_ADDRESS', 'http://localhost')


class BlockImportThread(threading.Thread):
    @classmethod
    def run(cls):
        server_address = get_server_address()
        db_uri = get_db_uri()
        api = DebuggerApi(server_address=server_address, db_uri=db_uri)
        while True:
            try:
                api.import_beacon_blocks()
            except Exception as e:
                logging.exception(str(e), exc_info=sys.exc_info())
            finally:
                api.db.session.remove()

            time.sleep(10)


def _initialize_db():
    server_address = get_server_address()
    db_uri = get_db_uri()
    api = DebuggerApi(server_address=server_address, db_uri=db_uri)
    with api.db.transaction_context():
        api.db.create_all()

    api.db.session.remove()


def _start_block_import_thread():
    block_import_thread = BlockImportThread()
    block_import_thread.daemon = True
    block_import_thread.start()


def on_starting():
    _initialize_db()
    _start_block_import_thread()
