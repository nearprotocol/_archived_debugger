import base64

import requests

from near.block_explorer_api import (b58, service)
from near.block_explorer_api.models import (
    Block, BlockOverview, ContractInfo, CreateAccountTransaction,
    DeployContractTransaction, FunctionCallTransaction, ListBlockResponse,
    SendMoneyTransaction, StakeTransaction, Transaction, TransactionInfo,
    SwapKeyTransaction,
)
from near.block_explorer_api.protos import signed_transaction_pb2


def decode_bytes(bytes_):
    return ''.join([chr(x) for x in bytes_])


def list_blocks(start=None, limit=None):
    url = service.config['RPC_URI'] + '/get_shard_blocks_by_index'
    params = {
        'start': start,
        'limit': limit,
    }
    response = requests.post(url, json=params)
    output = ListBlockResponse()
    for block in response.json()['blocks']:
        output.data.append(BlockOverview({
            'height': block['body']['header']['index'],
            'num_transactions': len(block['body']['transactions']),
            'num_receipts': len(block['body']['new_receipts'])
        }))
    return output


def _get_transaction(data):
    body = base64.b64decode(data['body'])
    transaction = signed_transaction_pb2.SignedTransaction()
    transaction.ParseFromString(body)
    transaction_type = transaction.WhichOneof('body')
    if transaction_type == 'send_money':
        body = SendMoneyTransaction({
            'originator': transaction.send_money.originator,
            'receiver': transaction.send_money.receiver,
            'amount': transaction.send_money    .amount,
        })
    elif transaction_type == 'stake':
        body = StakeTransaction({
            'originator': transaction.stake.originator,
            'amount': transaction.body.amount,
        })
    elif transaction_type == 'create_account':
        public_key = b58.b58encode(transaction.create_account.public_key)
        body = CreateAccountTransaction({
            'originator': transaction.create_account.originator,
            'new_account_id': transaction.create_account.new_account_id,
            'amount': transaction.create_account.amount,
            'public_key': public_key,
        })
    elif transaction_type == 'swap_key':
        cur_key = b58.b58encode(transaction.swap_key.cur_key)
        new_key = b58.b58encode(transaction.swap_key.new_key)
        body = SwapKeyTransaction({
            'originator': transaction.swap_key.originator,
            'cur_key': cur_key,
            'new_key': new_key,
        })
    elif transaction_type == 'deploy_contract':
        public_key = b58.b58encode(transaction.deploy_contract.public_key)
        body = DeployContractTransaction({
            'originator': transaction.deploy_contract.originator,
            'contract_id': transaction.deploy_contract.contract_id,
            'public_key': public_key,
        })
    elif transaction_type == 'function_call':
        body = FunctionCallTransaction({
            'originator': transaction.function_call.originator,
            'contract_id': transaction.function_call.contract_id,
            'amount': transaction.function_call.amount,
            'method_name': decode_bytes(transaction.function_call.method_name),
            'args': decode_bytes(transaction.function_call.args),
        })
    else:
        raise Exception("unhandled exception type: {}".format(transaction_type))

    return Transaction({
        'hash': data['hash'],
        'type': transaction_type,
        'body': body,
    })


def _get_block_from_response(block):
    parent_hash = block['body']['header']['parent_hash']
    if parent_hash == '11111111111111111111111111111111':
        parent_hash = None

    transactions = [_get_transaction(t) for t in block['body']['transactions']]
    return Block({
        'height': block['body']['header']['index'],
        'hash': block['hash'],
        'transactions': transactions,
        'parent_hash': parent_hash,
    })


def get_block_by_index(block_index):
    url = service.config['RPC_URI'] + '/get_shard_blocks_by_index'
    params = {
        'start': block_index,
        'limit': 1,
    }
    response = requests.post(url, json=params)
    data = response.json()
    assert len(data['blocks']) == 1
    block = data['blocks'][0]
    return _get_block_from_response(block)


def get_block_by_hash(block_hash):
    url = service.config['RPC_URI'] + '/get_shard_block_by_hash'
    params = {'hash': block_hash}
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.status_code
    block = response.json()
    return _get_block_from_response(block)


def list_transactions():
    pass


def get_transaction_info(transaction_hash):
    url = service.config['RPC_URI'] + '/get_transaction_info'
    params = {'hash': transaction_hash}
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.status_code
    data = response.json()
    transaction = _get_transaction(data['transaction'])
    return TransactionInfo({
        'block_index': data['block_index'],
        'status': data['result']['status'],
        'transaction': transaction,
    })


def get_contract_info(name):
    url = service.config['RPC_URI'] + '/view_state'
    params = {'contract_account_id': name}
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.status_code
    data = response.json()
    return ContractInfo({
        'state': {key: decode_bytes(value) for key, value in data["values"].items()}
    })
