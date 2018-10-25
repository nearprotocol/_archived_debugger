from setuptools import setup, find_packages

setup(
    name='near.dash_mock_node',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'flask==1.0.2',
        'gevent==1.3.7',
    ],
)
