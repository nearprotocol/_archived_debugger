import os

from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base

from near.block_explorer_api.utils.sql import Database

metadata = MetaData()

DbObject = declarative_base(metadata=metadata)


class Service(object):
    config = {
        'RPC_URI': os.environ.get('NEAR_RPC_URI', 'http://localhost:3030'),
    }

    def __init__(self):
        self._db = None

    @property
    def db(self):
        if self._db is None:
            raise Exception('service not configured')
        return self._db

    def configure(
            self,
            thread_local_db_session_getter=None,
            thread_local_db_session_setter=None,
    ):
        self._db = Database(
            metadata,
            thread_local_db_session_getter,
            thread_local_db_session_setter,
        )
        self._db.connect('sqlite:////tmp/dinger.db')


service = Service()
