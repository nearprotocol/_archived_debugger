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
