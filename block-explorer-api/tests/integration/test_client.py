import os

import delegator
import pytest
import requests
from retrying import retry


@retry(stop_max_attempt_number=5, wait_fixed=1000)
def check_devnet_health():
    response = requests.get('http://localhost:3030/healthz')
    assert response.status_code == 200


@pytest.fixture(scope='module')
def devnet_is_running():
    devnet_exe = os.environ['NEAR_DEVNET_EXE']
    command = delegator.run("{}".format(devnet_exe), block=False)
    check_devnet_health()
    yield True
    command.kill()


def test(devnet_is_running):
    assert devnet_is_running
