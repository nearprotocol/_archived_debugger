## Setup

### Install pipenv

```bash
pip install --user pipenv
```

### Install package

```bash
pipenv install -e .
```

## Running

Note: Make sure to have local devnet running at localhost:3030

```bash
pipenv run python -m near.debugger_api.web.run
```
