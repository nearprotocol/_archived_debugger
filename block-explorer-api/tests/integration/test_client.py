import os

import delegator
import pytest
from retrying import retry

from near.block_explorer_api.service import service

service.configure()


@retry(stop_max_attempt_number=5, wait_fixed=1000)
def check_devnet_health():
    assert service.nearlib.check_health()


@pytest.fixture(scope='module')
def devnet_is_running():
    devnet_exe = os.environ['NEAR_DEVNET_EXE']
    command = delegator.run("{}".format(devnet_exe), block=False)
    check_devnet_health()
    yield True
    command.kill()


def test(devnet_is_running):
    assert devnet_is_running
