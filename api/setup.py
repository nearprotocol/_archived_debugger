from setuptools import setup, find_packages

setup(
    name='near.debugger_api',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    setup_requires=['pytest-runner'],
)
