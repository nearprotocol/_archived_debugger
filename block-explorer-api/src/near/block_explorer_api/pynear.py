import requests

from near.block_explorer_api.service import service


def list_beacon_blocks(start=None, limit=None):
    url = service.config['RPC_URI'] + '/get_beacon_blocks_by_index'
    params = {
        'start': start,
        'limit': limit,
    }
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.text
    return response.json()


def get_shard_block_by_hash(block_hash):
    url = service.config['RPC_URI'] + '/get_shard_block_by_hash'
    params = {'hash': block_hash}
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.status_code
    return response.json()


def get_transaction_result(transaction_hash):
    url = service.config['RPC_URI'] + '/get_transaction_result'
    params = {'hash': transaction_hash}
    response = requests.post(url, json=params)
    assert response.status_code == 200, response.status_code
    return response.json()
