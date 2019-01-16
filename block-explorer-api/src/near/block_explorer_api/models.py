from schematics import Model
from schematics.types import (
    IntType,
    ListType,
    ModelType,
    StringType,
    UnionType,
)


class BlockOverview(Model):
    height = IntType(required=True)
    num_transactions = IntType(required=True)


class ListBlockResponse(Model):
    data = ListType(ModelType(BlockOverview), default=[], required=True)


class Block(Model):
    height = IntType(required=True)
    hash = StringType(required=True)
    num_transactions = StringType(required=True)
    parent_hash = StringType(required=True)


class SendMoneyTransaction(Model):
    originator = StringType(required=True)
    receiver = StringType(required=True)
    amount = IntType(required=True)


class Transaction(Model):
    hash = StringType(required=True)
    type = StringType(required=True)
    body = UnionType(
        [ModelType(SendMoneyTransaction)],
        required=True,
    )
