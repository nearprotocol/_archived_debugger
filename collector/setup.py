from setuptools import setup, find_packages

setup(
    name='near.dash_collector',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'requests==2.20.0',
    ],
    tests_require=[
        'flask==1.0.2',
    ],
)
