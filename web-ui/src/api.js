const API_URL = process.env.REACT_APP_API_URL

function handleErrors(response) {
  if (response.status !== 200) {
    throw response
  }
  return response;
}

export function listShardBlocks() {
  return fetch(`${API_URL}/list-shard-blocks`)
    .then(handleErrors)
    .then((response) => response.json())
}

export function getShardBlockByIndex(blockIndex) {
  return fetch(`${API_URL}/get-shard-block-by-index/${blockIndex}`)
    .then(handleErrors)
    .then((response) => response.json())
}

export function getTransactionInfo(hash) {
  return fetch(`${API_URL}/get-transaction-info/${hash}`)
    .then(handleErrors)
    .then((response) => response.json())
}

export function getContractInfo(name) {
  return fetch(`${API_URL}/get-contract-info/${name}`)
    .then(handleErrors)
    .then((response) => response.json())
}
