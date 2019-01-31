from flask import (
    Flask,
    jsonify,
)

from near.block_explorer_api import client

app = Flask(__name__)


@app.route('/list-shard-blocks', methods=['GET'])
def list_blocks():
    # TODO(#20): create api for server side pagination
    response = client.list_blocks(limit=100)
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/get-shard-block-by-index/<int:block_index>', methods=['GET'])
def get_shard_block_by_index(block_index):
    response = client.get_shard_block_by_index(block_index)
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/get-shard-block-by-hash/<block_hash>', methods=['GET'])
def get_shard_block_by_hash(block_hash):
    response = client.get_shard_block_by_hash(block_hash)
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/list-transactions', methods=['GET'])
def list_transactions():
    pass


@app.route('/get-transaction-info/<transaction_hash>', methods=['GET'])
def get_transaction_info(transaction_hash):
    response = client.get_transaction_info(transaction_hash)
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/get-contract-info/<name>', methods=['GET'])
def get_contract_info(name):
    response = client.get_contract_info(name)
    response.validate()
    return jsonify(response.to_primitive())


if __name__ == '__main__':
    app.run(port=5000, debug=True)
