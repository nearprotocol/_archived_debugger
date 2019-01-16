from flask import (
    Flask,
    jsonify,
)

from near.block_explorer_api import client

app = Flask(__name__)


@app.route('/list_blocks', methods=['GET'])
def list_blocks():
    response = client.list_blocks()
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/get_block_by_index/<int:block_index>', methods=['GET'])
def get_block_by_index(block_index):
    response = client.get_block_by_index(block_index)
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/get_block_by_hash/<block_hash>', methods=['GET'])
def get_block_by_hash(block_hash):
    response = client.get_block_by_hash(block_hash)
    response.validate()
    return jsonify(response.to_primitive())


@app.route('/list_transactions', methods=['GET'])
def list_transactions():
    pass


@app.route('/get_transaction_by_hash/<transaction_hash>', methods=['GET'])
def get_transaction_by_hash(transaction_hash):
    response = client.get_transaction_by_hash(transaction_hash)
    response.validate()
    return jsonify(response.to_primitive())


if __name__ == '__main__':
    app.run(port=5000, debug=True)
