from setuptools import setup, find_packages

setup(
    name='near.collector',
    version='0.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'flask==1.0.2',
    ]
)
