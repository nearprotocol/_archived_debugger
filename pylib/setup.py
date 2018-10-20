from setuptools import (
    find_packages,
    setup,
)

setup(
    name='near.dash_pylib',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'schematics==2.1.0',
    ],
)
