from near.pynear.test_utils.cli import CliHelpers
# noinspection PyUnresolvedReferences
from near.pynear.test_utils.fixtures import *

from near.debugger_api.api import DebuggerApi


def _make_debugger_api(port):
    api = DebuggerApi(server_port=port)
    api.db.create_all()
    return api


def test_import_block_pagination(make_devnet, tmpdir):
    port = make_devnet(tmpdir)
    api = _make_debugger_api(port)
    for i in range(0, 1):
        account_id = "test_account.{}".format(i)
        CliHelpers(port).create_account(account_id)

    api.import_beacon_blocks()
    response = api.list_beacon_blocks()
    assert len(response.data) == 3


def test_deploy_contract_transaction(make_devnet, tmpdir, tmp_path):
    port = make_devnet(tmpdir)
    api = _make_debugger_api(port)
    contract_name = 'deploy_contract_test'

    wasm_file = tmp_path / 'dummy.wasm'
    wasm_file.write_bytes(bytearray([]))
    wasm_path = str(wasm_file.resolve())
    _, transaction_hash = CliHelpers(port).deploy_contract(
        contract_name,
        wasm_path,
    )

    @retry(stop_max_attempt_number=5, wait_fixed=1000)
    def _wait_for_transaction():
        api.import_beacon_blocks()
        transaction = api.get_transaction_info(transaction_hash)
        assert transaction is not None
        return transaction

    _wait_for_transaction()
