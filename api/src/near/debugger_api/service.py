import os

from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base

from near.debugger_api.utils.sql import Database
from near.pynear.lib import NearLib

metadata = MetaData()

DbObject = declarative_base(metadata=metadata)


class Service(object):
    def __init__(self):
        self._db = None
        self._nearlib = None

    @property
    def db(self):
        if self._db is None:
            raise Exception('service not configured')
        return self._db

    @property
    def nearlib(self):
        if self._nearlib is None:
            raise Exception('service is not configured')
        return self._nearlib

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

        rpc_uri = os.environ.get('NEAR_RPC_URI', 'http://localhost:3030/')
        self._nearlib = NearLib(rpc_uri)


service = Service()
