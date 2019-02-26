from schematics import Model
from schematics.types import (
    BaseType,
    BooleanType,
    DictType,
    IntType,
    ListType,
    ModelType,
    StringType,
    UnionType,
)


class SortOption(Model):
    desc = BooleanType(required=True)
    id = StringType(required=True)


class PaginationOptions(Model):
    page_size = IntType(default=10)
    page = IntType(default=0)
    sort_options = ListType(ModelType(SortOption), default=[])


class ShardBlockOverview(Model):
    index = IntType(required=True)
    hash = StringType(required=True)
    num_transactions = IntType(required=True)
    num_receipts = IntType(required=True)


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


class FunctionCallTransaction(Model):
    originator = StringType(required=True)
    contract_id = StringType(required=True)
    method_name = StringType(required=True)
    args = BaseType(required=True)
    amount = IntType(required=True)


class Receipt(Model):
    hash = StringType(required=True)
    originator = StringType(required=True)
    receiver = StringType(required=True)
    body = StringType(required=True)
    # noinspection PyTypeChecker
    receipts = ListType(ModelType('Receipt'))


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
    receipts = ListType(ModelType(Receipt), required=True, default=[])


class Log(Model):
    transaction_hash = StringType()
    receipt_hash = StringType()
    lines = ListType(StringType)


class TransactionInfo(Model):
    shard_block = ModelType(ShardBlockOverview, required=True)
    status = StringType(required=True)
    transaction = ModelType(Transaction, required=True)
    logs = ListType(ModelType(Log), required=True, default=True)


class ContractInfo(Model):
    state = DictType(StringType)


class ShardBlock(Model):
    index = IntType(required=True)
    hash = StringType(required=True)
    transactions = ListType(ModelType(Transaction), default=[])
    parent_hash = StringType()


class ListShardBlockResponse(Model):
    data = ListType(ModelType(ShardBlockOverview), default=[], required=True)


class BeaconBlock(Model):
    index = IntType(required=True)
    hash = StringType(required=True)
    parent_hash = StringType()
    shard_block = ModelType(ShardBlockOverview, required=True)


class BeaconBlockOverview(Model):
    index = IntType(required=True)


class ListBeaconBlockResponse(Model):
    data = ListType(ModelType(BeaconBlockOverview), default=[], required=True)
    num_pages = IntType(required=True)
