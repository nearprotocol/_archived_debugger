from setuptools import (
    find_packages,
    setup,
)

setup(
    name='near.dash_backend',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'flask==1.0.2',
        'Flask-SocketIO==3.0.2',
        'gevent==1.3.7',
        'gevent-websocket==0.10.1',
        'redis==2.10.6',
        'schematics==2.1.0',
    ],
    tests_require=[
        'fakeredis==0.14.0',
        'nose==1.3.7',
    ]
)
