import base64
import json
import logging
import math
from typing import Callable, Optional, Type, Union

from near.pynear import b58, protos
from near.pynear.lib import NearLib
from sqlalchemy.orm import Session

from near.debugger_api import db_objects
from near.debugger_api.db_objects import (
    DbObject, BeaconBlockDbObject, ReceiptDbObject, ShardBlockDbObject,
    TransactionDbObject,
)
from near.debugger_api.models import (
    BeaconBlock, BeaconBlockOverview, ContractInfo, CreateAccountTransaction,
    DeployContractTransaction, FunctionCallTransaction, ListBeaconBlockResponse,
    ListShardBlockResponse, Log, Receipt, PaginationOptions, SendMoneyTransaction,
    ShardBlock, ShardBlockOverview, SortOption, StakeTransaction, SwapKeyTransaction,
    Transaction, TransactionInfo,
)
from near.debugger_api.utils.sql import Database


class DebuggerApi(object):
    def __init__(
            self,
            server_address: str = 'http://localhost',
            server_port: int = 3030,
            db_uri: str = 'sqlite://',
            thread_local_db_session_getter: Callable[[], Session] = None,
            thread_local_db_session_setter: Callable[[Session], None] = None,
    ):
        server_uri = "{}:{}/".format(server_address, server_port)
        self._nearlib = NearLib(server_uri)
        self.db = Database(
            db_objects.metadata,
            thread_local_db_session_getter,
            thread_local_db_session_setter,
        )
        self.db.connect(db_uri)

    def list_beacon_blocks(
            self,
            pagination_options: Optional[PaginationOptions] = None,
    ) -> ListBeaconBlockResponse:
        pagination_options = _validate_pagination_options(
            BeaconBlockDbObject,
            pagination_options,
        )
        if len(pagination_options.sort_options) == 0:
            pagination_options.sort_options = [
                SortOption({'id': 'index', 'desc': True})
            ]

        order_by = []
        for sort_option in pagination_options.sort_options:
            order = getattr(BeaconBlockDbObject, sort_option.id)
            if sort_option.desc:
                order = order.desc()
            order_by.append(order)

        offset = pagination_options.page * pagination_options.page_size
        output = ListBeaconBlockResponse()
        beacon_blocks = self.db.session.query(BeaconBlockDbObject) \
            .order_by(*order_by) \
            .offset(offset) \
            .limit(pagination_options.page_size) \
            .all()

        for block in beacon_blocks:
            output.data.append(BeaconBlockOverview({
                'index': block.index,
            }))

        count = self.db.session.query(BeaconBlockDbObject).count()
        output.num_pages = count // pagination_options.page_size + 1
        return output

    def get_beacon_block_by_index(self, index: int) -> Optional[BeaconBlock]:
        block = self.db.session.query(BeaconBlockDbObject) \
            .filter(BeaconBlockDbObject.index == index) \
            .first()

        if block is None:
            return None

        assert len(block.shard_blocks) == 1
        shard_block = _get_shard_block_overview(block.shard_blocks[0])
        return BeaconBlock({
            'index': index,
            'hash': block.hash,
            'parent_hash': block.parent_hash,
            'shard_block': shard_block,
        })

    def list_shard_blocks(
            self,
            pagination_options: Optional[PaginationOptions] = None
    ) -> ListShardBlockResponse:
        pagination_options = _validate_pagination_options(
            ShardBlockDbObject,
            pagination_options,
        )
        if len(pagination_options.sort_options) == 0:
            pagination_options.sort_options = [
                SortOption({'id': 'index', 'desc': True})
            ]

        order_by = []
        for sort_option in pagination_options.sort_options:
            order = getattr(ShardBlockDbObject, sort_option.id)
            if sort_option.desc:
                order = order.desc()
            order_by.append(order)

        output = ListShardBlockResponse()
        offset = pagination_options.page * pagination_options.page_size
        shard_blocks = self.db.session.query(ShardBlockDbObject) \
            .order_by(*order_by) \
            .offset(offset) \
            .limit(pagination_options.page_size) \
            .all()

        for block in shard_blocks:
            output.data.append(_get_shard_block_overview(block))

        count = self.db.session.query(ShardBlockDbObject).count()
        output.num_pages = math.ceil(count / pagination_options.page_size)
        return output

    def get_shard_block_by_index(self, index: int) -> Optional[ShardBlock]:
        block = self.db.session.query(ShardBlockDbObject) \
            .filter(ShardBlockDbObject.index == index) \
            .first()

        if block is None:
            return None

        transactions = [_get_transaction(t) for t in block.transactions]
        return ShardBlock({
            'index': block.index,
            'hash': block.hash,
            'transactions': transactions,
            'parent_hash': block.parent_hash,
        })

    def get_transaction_info(
            self,
            transaction_hash: str,
    ) -> Optional[TransactionInfo]:
        transaction = self.db.session.query(TransactionDbObject) \
            .get(transaction_hash)
        if transaction is None:
            return None

        # TODO(#26): stop fetching transaction status from nearcore
        data = self._nearlib.get_transaction_result(transaction_hash)

        logs = []
        for log in data['result']['logs']:
            if len(log['lines']) == 0:
                continue

            log_ = Log({'lines': log['lines']})
            hash_ = b58.b58encode(log['hash'])
            if hash_ == transaction_hash:
                log_.transaction_hash = hash_
            else:
                log_.receipt_hash = hash_
            logs.append(log_)

        shard_block = _get_shard_block_overview(transaction.shard_block)
        transaction = _get_transaction(transaction)
        return TransactionInfo({
            'status': data['result']['status'],
            'transaction': transaction,
            'logs': logs,
            'shard_block': shard_block,
        })

    def get_contract_info(self, name: str) -> ContractInfo:
        data = self._nearlib.get_contract_info(name)
        state = {
            key: bytearray(value).decode('utf-8')
            for key, value in data['values'].items()
        }
        return ContractInfo({'state': state})

    def _import_beacon_blocks(
            self,
            start_index: int,
            transactions_seen: Optional[set] = None,
    ) -> (bool, Optional[int]):
        response = self._nearlib.list_beacon_blocks(start_index)
        num_blocks = len(response['blocks'])
        if num_blocks == 0:
            return False, None

        if transactions_seen is None:
            hashes = self.db.session.query(TransactionDbObject.hash).all()
            transactions_seen = set([r[0] for r in hashes])

        logging.info("attempting to import {} beacon blocks".format(num_blocks))

        transaction_results = {}
        last_block_index = None
        with self.db.transaction_context():
            for beacon_block in response['blocks']:
                header = beacon_block['body']['header']

                parent_hash = header['parent_hash']
                if parent_hash == '11111111111111111111111111111111':
                    parent_hash = None

                beacon_block_db_object = BeaconBlockDbObject(
                    hash=beacon_block['hash'],
                    index=header['index'],
                    parent_hash=parent_hash,
                )
                last_block_index = header['index']
                self.db.session.add(beacon_block_db_object)

                shard_block_hashes = [header['shard_block_hash']]
                for shard_block_hash in shard_block_hashes:
                    shard_block = self._nearlib.get_shard_block_by_hash(shard_block_hash)

                    header = shard_block['body']['header']
                    parent_hash = header['parent_hash']
                    if parent_hash == '11111111111111111111111111111111':
                        parent_hash = None

                    shard_block_db_object = ShardBlockDbObject(
                        hash=shard_block['hash'],
                        index=header['index'],
                        shard_id=header['shard_id'],
                        parent_hash=parent_hash,
                        beacon_block=beacon_block_db_object,
                    )
                    self.db.session.add(shard_block_db_object)

                    for transaction in shard_block['body']['transactions']:
                        # TODO(#35): figure out why transactions appear multiple times
                        hash_ = transaction['hash']
                        if hash_ in transactions_seen:
                            logging.info("transaction {} already entered".format(hash_))
                            continue

                        transactions_seen.add(hash_)

                        result = self._nearlib.get_transaction_result(hash_)
                        for log in result['result']['logs']:
                            parent_hash = b58.b58encode(log['hash'])
                            for receipt_hash in log['receipts']:
                                if parent_hash == transaction['hash'].encode('utf-8'):
                                    parent_hash = None

                                transaction_results[b58.b58encode(receipt_hash)] = (
                                    parent_hash,
                                    transaction['hash'],
                                )

                        transaction_db_object = TransactionDbObject(
                            hash=hash_,
                            body=transaction['body'],
                            shard_block=shard_block_db_object,
                        )
                        self.db.session.add(transaction_db_object)

                    for receipt_block in shard_block['body']['receipts']:
                        for receipt in receipt_block['receipts']:
                            hash_ = b58.b58encode(receipt['nonce'])
                            # TODO(#36): fix lookup if txn does not exist in fetch
                            if hash_ not in transaction_results:
                                continue

                            parent_hash, transaction_hash = transaction_results[hash_]
                            body = json.dumps(receipt['body'])
                            receipt_db_object = ReceiptDbObject(
                                hash=hash_,
                                transaction_hash=transaction_hash,
                                shard_block_hash=shard_block['hash'],
                                parent_hash=parent_hash,
                                originator=receipt['originator'],
                                receiver=receipt['receiver'],
                                body=body,
                            )
                            self.db.session.add(receipt_db_object)

            logging.info("successfully imported {} beacon blocks".format(num_blocks))
            return True, last_block_index + 1

    def import_beacon_blocks(self):
        latest_block_index = self.db.session.query(BeaconBlockDbObject.index) \
            .order_by(BeaconBlockDbObject.index.desc()) \
            .first()

        if latest_block_index is None:
            start_index = 0
        else:
            start_index = latest_block_index[0] + 1

        has_next = True
        while has_next:
            has_next, start_index = self._import_beacon_blocks(start_index)


def _validate_pagination_options(
        db_object_cls: Type[DbObject],
        options: Optional[PaginationOptions] = None,
) -> PaginationOptions:
    if options is None:
        options = PaginationOptions()

    column_names = [column.name for column in db_object_cls.__table__.columns]
    for sort_option in options.sort_options:
        if sort_option.id not in column_names:
            msg = "sort id {} not a column of {}" \
                .format(sort_option.id, db_object_cls)
            raise Exception(msg)
    return options


def _get_shard_block_overview(block: ShardBlock) -> ShardBlockOverview:
    return ShardBlockOverview({
        'index': block.index,
        'hash': block.hash,
        'num_transactions': len(block.transactions),
        'num_receipts': len(block.receipts)
    })


def _get_receipt(db_object):
    receipts = [_get_receipt(r) for r in db_object.children]
    return Receipt({
        'hash': db_object.hash,
        'originator': db_object.originator,
        'receiver': db_object.receiver,
        'body': db_object.body,
        'receipts': receipts,
    })


def _decode_transaction_body(body: str) -> (
        str,
        Union[
            CreateAccountTransaction,
            DeployContractTransaction,
            FunctionCallTransaction,
            SendMoneyTransaction,
            StakeTransaction,
            SwapKeyTransaction,
        ]
):
    transaction = protos.signed_transaction_pb2.SignedTransaction()
    transaction.ParseFromString(body)
    transaction_type = transaction.WhichOneof('body')
    if transaction_type == 'create_account':
        public_key = b58.b58encode(transaction.create_account.public_key)
        body = CreateAccountTransaction({
            'originator': transaction.create_account.originator,
            'new_account_id': transaction.create_account.new_account_id,
            'amount': transaction.create_account.amount,
            'public_key': public_key,
        })
    elif transaction_type == 'deploy_contract':
        body = DeployContractTransaction({
            'contract_id': transaction.deploy_contract.contract_id,
        })
    elif transaction_type == 'function_call':
        method_name = transaction.function_call.method_name
        method_name = bytearray(method_name).decode('utf-8')
        args = transaction.function_call.args
        args = bytearray(args).decode('utf-8')
        body = FunctionCallTransaction({
            'originator': transaction.function_call.originator,
            'contract_id': transaction.function_call.contract_id,
            'amount': transaction.function_call.amount,
            'method_name': method_name,
            'args': args,
        })
    elif transaction_type == 'send_money':
        body = SendMoneyTransaction({
            'originator': transaction.send_money.originator,
            'receiver': transaction.send_money.receiver,
            'amount': transaction.send_money.amount,
        })
    elif transaction_type == 'stake':
        body = StakeTransaction({
            'originator': transaction.stake.originator,
            'amount': transaction.body.amount,
        })
    elif transaction_type == 'swap_key':
        cur_key = b58.b58encode(transaction.swap_key.cur_key)
        new_key = b58.b58encode(transaction.swap_key.new_key)
        body = SwapKeyTransaction({
            'originator': transaction.swap_key.originator,
            'cur_key': cur_key,
            'new_key': new_key,
        })
    else:
        raise Exception("unhandled exception type: {}".format(transaction_type))

    return transaction_type, body


def _get_transaction(transaction: TransactionDbObject) -> Transaction:
    body = base64.b64decode(transaction.body)
    transaction_type, body = _decode_transaction_body(body)
    receipts = [_get_receipt(r) for r in transaction.receipts]
    return Transaction({
        'hash': transaction.hash,
        'type': transaction_type,
        'body': body,
        'receipts': receipts,
    })
