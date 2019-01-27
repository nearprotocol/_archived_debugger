import requests

from near.block_explorer_api import service
from near.block_explorer_api.models import (
    Block,
    BlockOverview,
    CreateAccountTransaction,
    ListBlockResponse,
    SendMoneyTransaction,
    StakeTransaction,
    Transaction,
    TransactionInfo,
    SwapKeyTransaction, DeployContractTransaction, FunctionCallTransaction,
    ContractInfo)


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
        }))
    return output


def _get_transaction(data):
    body = data['body']
    transaction_type = list(body.keys())[0]
    transaction_body = body[transaction_type]
    if transaction_type == 'SendMoney':
        body = SendMoneyTransaction({
            'receiver': transaction_body['receiver'],
            'amount': transaction_body['amount'],
        })
    elif transaction_type == 'Stake':
        body = StakeTransaction({
            'amount': transaction_body['amount'],
        })
    elif transaction_type == 'CreateAccount':
        body = CreateAccountTransaction({
            'new_account_id': transaction_body['new_account_id'],
            'amount': transaction_body['amount'],
            # TODO (#21): add once encoding is fixed
            'public_key': '',
        })
    elif transaction_type == 'SwapKey':
        body = SwapKeyTransaction({
            # TODO (#21): add once encoding is fixed
            'current_key': '',
            'new_key': '',
        })
    elif transaction_type == 'DeployContract':
        body = DeployContractTransaction({
            'contract_id': transaction_body['contract_id'],
            # TODO (#21): add once encoding is fixed
            'public_key': '',
        })
    elif transaction_type == 'FunctionCall':
        body = FunctionCallTransaction({
            'contract_id': transaction_body['contract_id'],
            'amount': transaction_body['amount'],
            # TODO (#21): add once encoding is fixed
            'method_name': '',
            'args': '',
        })
    else:
        raise Exception("unhandled exception type: {}".format(transaction_type))

    return Transaction({
        'hash': data['hash'],
        'type': transaction_type,
        'originator': transaction_body['originator'],
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
        'status': data['status'],
        'transaction': transaction,
    })


def get_contract_info(name):
    url = service.config['RPC_URI'] + '/view_state'
    params = {'contract_account_id': name}
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.status_code
    data = response.json()
    return ContractInfo({
        'state': data["values"]
    })
