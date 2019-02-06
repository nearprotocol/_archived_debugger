from flask import Blueprint, jsonify

from near.block_explorer_api import client
from near.block_explorer_api.models import ListBeaconBlockResponse

blueprint = Blueprint('api', __name__)


@blueprint.route(
    '/list-beacon-blocks',
    methods=['GET'],
    output_schema=ListBeaconBlockResponse,
)
def list_beacon_blocks():
    # TODO(#20): create api for server side pagination
    response = client.list_beacon_blocks()
    return jsonify(response.to_primitive())


@blueprint.route('/get-beacon-block-by-index/<int:block_index>', methods=['GET'])
def get_beacon_block_by_index(block_index):
    response = client.get_beacon_block_by_index(block_index)
    response.validate()
    return jsonify(response.to_primitive())


@blueprint.route('/list-shard-blocks', methods=['GET'])
def list_shard_blocks():
    # TODO(#20): create api for server side pagination
    response = client.list_shard_blocks()
    response.validate()
    return jsonify(response.to_primitive())


@blueprint.route('/get-shard-block-by-index/<int:block_index>', methods=['GET'])
def get_shard_block_by_index(block_index):
    response = client.get_shard_block_by_index(block_index)
    response.validate()
    return jsonify(response.to_primitive())


@blueprint.route('/get-transaction-info/<transaction_hash>', methods=['GET'])
def get_transaction_info(transaction_hash):
    response = client.get_transaction_info(transaction_hash)
    response.validate()
    return jsonify(response.to_primitive())


@blueprint.route('/get-contract-info/<name>', methods=['GET'])
def get_contract_info(name):
    response = client.get_contract_info(name)
    response.validate()
    return jsonify(response.to_primitive())
