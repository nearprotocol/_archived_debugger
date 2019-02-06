from contextlib import contextmanager

from sqlalchemy import create_engine, TypeDecorator
from sqlalchemy.orm import scoped_session, sessionmaker


class Database(object):
    def __init__(self, metadata, session_getter=None, session_setter=None):
        self.engine = None
        self._session_factory = None
        self._session = None
        if session_getter is None:
            session_getter = self._default_session_getter
        self._session_getter = session_getter
        if session_setter is None:
            session_setter = self._default_session_setter
        self._session_setter = session_setter
        self._metadata = metadata

    def create_all(self):
        self._metadata.create_all(bind=self.engine)

    def drop_all(self):
        self._metadata.drop_all(bind=self.engine, checkfirst=True)

    def connect(self, database_uri, pool_recycle=3600, echo=False):
        self.engine = create_engine(
            database_uri,
            pool_recycle=pool_recycle,
            echo=echo,
        )
        self._session_factory = sessionmaker(
            bind=self.engine,
            autocommit=False,
            autoflush=False,
        )

    def _default_session_getter(self):
        return self._session

    def _default_session_setter(self, value):
        self._session = value

    @property
    def session(self):
        return self._session_getter()

    @session.setter
    def session(self, value):
        self._session_setter(value)

    def initialize_session(self):
        if self.session is None:
            self.session = scoped_session(self._session_factory)
        return self.session

    def remove_session(self):
        if self.session is not None:
            self.session.remove()
            self.session = None

    @contextmanager
    def transaction_context(self):
        try:
            yield self.initialize_session()
        except Exception as e:
            if self.session is not None:
                self.session.rollback()
            raise e
        finally:
            if self.session is not None:
                self.session.commit()


class CustomSqlalchemyType(TypeDecorator):
    coerce_to_is_types = ()
    python_type = NotImplemented

    def process_result_value(self, value, dialect):
        raise NotImplementedError

    def process_literal_param(self, value, dialect):
        raise NotImplementedError

    def process_bind_param(self, value, dialect):
        return self.process_literal_param(value, dialect)
