import sys
import threading
import time

from near.block_explorer_api import client
from near.block_explorer_api.service import service
from near.block_explorer_api.web.app import create_app

if __name__ == '__main__':
    app = create_app(service)


    @app.before_first_request
    def _init_db():
        with service.db.transaction_context():
            service.db.create_all()


    class BlockImportThread(threading.Thread):
        @classmethod
        def run(cls):
            while True:
                try:
                    with app.app_context():
                        client.import_beacon_blocks()
                except Exception as e:
                    print(e, file=sys.stderr)

                time.sleep(10)


    block_import_thread = BlockImportThread()
    block_import_thread.start()

    app.run(host='0.0.0.0', port=5000)
