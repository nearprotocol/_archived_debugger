import os
import sys

import delegator
import pexpect
import pytest


@pytest.fixture(scope='module')
def devnet_is_running():
    devnet_exe = os.environ['NEAR_DEVNET_EXE']
    command = delegator.run("{}".format(devnet_exe), block=False)
    try:
        command.expect('Devnet started', timeout=1)
    except pexpect.EOF:
        print(command.subprocess.before, file=sys.stderr)
        raise Exception('devnet startup failed')

    yield True
    command.kill()


def test(devnet_is_running):
    assert devnet_is_running
