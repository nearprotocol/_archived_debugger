from sqlalchemy import Column, Index, Integer, String, ForeignKey, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import backref, relationship

metadata = MetaData()

DbObject = declarative_base(metadata=metadata)


class BeaconBlockDbObject(DbObject):
    __tablename__ = 'beacon_block'

    hash = Column(String, primary_key=True)
    index = Column(Integer)
    parent_hash = Column(String)

    shard_blocks = relationship(
        'ShardBlockDbObject',
        foreign_keys='ShardBlockDbObject.beacon_block_hash',
        primaryjoin='ShardBlockDbObject.beacon_block_hash == BeaconBlockDbObject.hash',
        backref=backref('beacon_block', uselist=False),
    )


class ShardBlockDbObject(DbObject):
    __tablename__ = 'shard_block'

    hash = Column(String, primary_key=True)
    index = Column(Integer)
    shard_id = Column(String)
    parent_hash = Column(String)

    beacon_block_hash = Column(String)

    transactions = relationship(
        'TransactionDbObject',
        foreign_keys='TransactionDbObject.shard_block_hash',
        primaryjoin='TransactionDbObject.shard_block_hash == ShardBlockDbObject.hash',
        backref=backref('shard_block', uselist=False),
    )
    receipts = relationship(
        'ReceiptDbObject',
        foreign_keys='ReceiptDbObject.shard_block_hash',
        primaryjoin='ShardBlockDbObject.hash == ReceiptDbObject.shard_block_hash',
        backref=backref('shard_block', uselist=False),
    )


class TransactionDbObject(DbObject):
    __tablename__ = 'transaction'

    hash = Column(String, primary_key=True)
    body = Column(String)

    shard_block_hash = Column(String)

    receipts = relationship(
        'ReceiptDbObject',
        foreign_keys='ReceiptDbObject.transaction_hash',
        primaryjoin='TransactionDbObject.hash == ReceiptDbObject.transaction_hash',
        backref=backref('transaction', uselist=False),
    )


class ReceiptDbObject(DbObject):
    __tablename__ = 'receipt'
    __tableargs__ = (
        Index('transaction_hash'),
    )

    hash = Column(String, primary_key=True)
    transaction_hash = Column(String)
    shard_block_hash = Column(String)

    originator = Column(String)
    receiver = Column(String)
    body = Column(String)

    # explicitly using ForeignKey here because adjacency list docs
    # rely on it, and too lazy to figure out how to accomplish otherwise
    # for now (https://docs.sqlalchemy.org/en/latest/orm/self_referential.html)
    parent_hash = Column(String, ForeignKey('receipt.hash'))

    children = relationship(
        'ReceiptDbObject',
        backref=backref('parent', remote_side=[hash])
    )
