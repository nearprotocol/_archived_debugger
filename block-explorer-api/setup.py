from setuptools import setup, find_packages

setup(
    name='near.block_explorer_api',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'flask==1.0.2',
        'gevent==1.3.7',
        'requests==2.21.0',
        'schematics @ git+https://github.com/azban/schematics.git@abc09ef84624b4648b5fc7b5f4b64b69d36241c8',
    ],
)
