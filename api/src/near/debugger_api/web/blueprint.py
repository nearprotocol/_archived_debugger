import json

from flask import Blueprint, jsonify, request

from near.debugger_api import client
from near.debugger_api.models import (
    BeaconBlock, ListBeaconBlockResponse, ListShardBlockResponse,
    PaginationOptions, ShardBlock, TransactionInfo,
)
from near.debugger_api.service import service

blueprint = Blueprint('api', __name__)


def _get_pagination_options_from_args(args):
    options = PaginationOptions()
    if 'page_size' in args:
        options.page_size = args['page_size']
    if 'page' in args:
        options.page = args.get('page')
    if 'sort_options' in args:
        options.sort_options = json.loads(args['sort_options'])
    options.validate()
    return options


@blueprint.route(
    '/list-beacon-blocks',
    methods=['GET'],
    output_schema=ListBeaconBlockResponse,
)
def list_beacon_blocks():
    pagination_options = _get_pagination_options_from_args(request.args)
    response = client.list_beacon_blocks(pagination_options)
    return jsonify(response.to_primitive())


@blueprint.route(
    '/get-beacon-block-by-index/<int:block_index>',
    methods=['GET'],
    output_schema=BeaconBlock,
)
def get_beacon_block_by_index(block_index):
    response = client.get_beacon_block_by_index(block_index)
    return jsonify(response.to_primitive())


@blueprint.route(
    '/list-shard-blocks',
    methods=['GET'],
    output_schema=ListShardBlockResponse,
)
def list_shard_blocks():
    # TODO(#20): create api for server side pagination
    response = client.list_shard_blocks()
    return jsonify(response.to_primitive())


@blueprint.route(
    '/get-shard-block-by-index/<int:block_index>',
    methods=['GET'],
    output_schema=ShardBlock,
)
def get_shard_block_by_index(block_index):
    response = client.get_shard_block_by_index(block_index)
    return jsonify(response.to_primitive())


@blueprint.route(
    '/get-transaction-info/<transaction_hash>',
    methods=['GET'],
    output_schema=TransactionInfo,
)
def get_transaction_info(transaction_hash):
    response = client.get_transaction_info(transaction_hash)
    return jsonify(response.to_primitive())


@blueprint.route('/get-contract-info/<name>', methods=['GET'])
def get_contract_info(name):
    response = client.get_contract_info(name)
    response.validate()
    return jsonify(response.to_primitive())


@blueprint.before_request
def _import_blocks():
    try:
        client.import_beacon_blocks()
    except Exception as e:
        print('importing failed.. could be due to simultaneous requests')
        print(e)
        service.db.session.remove()
