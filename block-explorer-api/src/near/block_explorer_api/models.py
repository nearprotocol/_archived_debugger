from schematics import Model
from schematics.types import (
    IntType,
    ListType,
    ModelType,
    StringType,
    UnionType,
    BaseType,
    DictType)


class BlockOverview(Model):
    height = IntType(required=True)
    num_transactions = IntType(required=True)
    num_receipts = IntType(required=True)


class ListBlockResponse(Model):
    data = ListType(ModelType(BlockOverview), default=[], required=True)


class CreateAccountTransaction(Model):
    originator = StringType(required=True)
    new_account_id = StringType(required=True)
    amount = IntType(required=True)
    public_key = StringType(required=True)


class SendMoneyTransaction(Model):
    originator = StringType(required=True)
    receiver = StringType(required=True)
    amount = IntType(required=True)


class StakeTransaction(Model):
    originator = StringType(required=True)
    amount = IntType(required=True)


class SwapKeyTransaction(Model):
    originator = StringType(required=True)
    cur_key = StringType(required=True)
    new_key = StringType(required=True)


class DeployContractTransaction(Model):
    originator = StringType(required=True)
    contract_id = StringType(required=True)
    public_key = StringType(required=True)


class FunctionCallTransaction(Model):
    originator = StringType(required=True)
    contract_id = StringType(required=True)
    method_name = StringType(required=True)
    args = BaseType(required=True)
    amount = IntType(required=True)


class Transaction(Model):
    hash = StringType(required=True)
    type = StringType(required=True)
    body = UnionType(
        (
            ModelType(CreateAccountTransaction),
            ModelType(DeployContractTransaction),
            ModelType(FunctionCallTransaction),
            ModelType(SendMoneyTransaction),
            ModelType(StakeTransaction),
            ModelType(SwapKeyTransaction),
        ),
        required=True,
    )


class TransactionInfo(Model):
    block_index = IntType(required=True)
    status = StringType(required=True)
    transaction = ModelType(Transaction, required=True)


class Block(Model):
    height = IntType(required=True)
    hash = StringType(required=True)
    transactions = ListType(ModelType(Transaction), default=[])
    parent_hash = StringType()


class ContractInfo(Model):
    state = DictType(StringType)
