from setuptools import setup, find_packages

setup(
    name='near.block_explorer_api',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'flask==1.0.2',
        'gevent==1.3.7',
        'protobuf==3.6.1',
        'requests==2.21.0',
        'schematics @ git+https://github.com/azban/schematics.git@abc09ef84624b4648b5fc7b5f4b64b69d36241c8',
        'sqlalchemy==1.2.17',
    ],
    setup_requires=['pytest-runner'],
    tests_require=[
        'delegator.py==0.1.1',
        'pytest==4.3.0',
    ],
)
