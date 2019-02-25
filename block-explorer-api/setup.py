from setuptools import setup, find_packages
from setuptools.command.develop import develop
from setuptools.command.install import install
from setuptools.command.test import test
import subprocess

PYNEAR_HASH = '070c6829d211d9132fb5847b4314a46f42136865'


# required because of https://stackoverflow.com/a/53412651
def install_pynear(install_test_utils=False):
    pip_url = "git+https://github.com/nearprotocol/" \
              "nearcore.git@{}#egg=near.pynear&subdirectory=pynear" \
        .format(PYNEAR_HASH)
    if install_test_utils:
        pip_url += '[test_utils]'
    pip_command = "pip install {}".format(pip_url)
    subprocess.check_call(pip_command.split())


class CustomDevelop(develop):
    def run(self):
        install_pynear()
        develop.run(self)


class CustomInstall(install):
    def run(self):
        install_pynear()
        install.run(self)


class CustomTest(test):
    def run(self):
        install_pynear(install_test_utils=True)
        test.run(self)


setup(
    name='near.block_explorer_api',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    cmdclass={
        'develop': CustomDevelop,
        'install': CustomInstall,
        'test': CustomTest,
    },
    install_requires=[
        'flask==1.0.2',
        'gevent==1.3.7',
        'requests==2.21.0',
        'schematics @ git+https://github.com/azban/schematics.git@abc09ef84624b4648b5fc7b5f4b64b69d36241c8',
        'sqlalchemy==1.2.17',
    ],
    setup_requires=['pytest-runner'],
    tests_require=[
        'delegator.py==0.1.1',
        'pytest==4.3.0',
        'retrying==1.3.3',
    ],
)
