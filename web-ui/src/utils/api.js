const API_URL = process.env.REACT_APP_API_URL


function dictToURI(dict) {
   var str = [];
   for (var p in dict) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
   }
   return str.join("&");
}

export function generatePaginationOptions(page, pageSize, sortOptions) {
   return dictToURI({
      page,
      page_size: pageSize,
      sort_options: JSON.stringify(sortOptions),
   })
}

function handleErrors(response) {
   if (response.status !== 200) {
      throw response
   }
   return response;
}

export function listShardBlocks(paginationOptions) {
   return fetch(`${API_URL}/list-shard-blocks?${paginationOptions}`)
      .then(handleErrors)
      .then((response) => response.json())
}

export function getShardBlockByIndex(blockIndex) {
   return fetch(`${API_URL}/get-shard-block-by-index/${blockIndex}`)
      .then(handleErrors)
      .then((response) => response.json())
}

export function listBeaconBlocks(paginationOptions) {
   return fetch(`${API_URL}/list-beacon-blocks?${paginationOptions}`)
      .then(handleErrors)
      .then((response) => response.json())
}

export function getBeaconBlockByIndex(blockIndex) {
   return fetch(`${API_URL}/get-beacon-block-by-index/${blockIndex}`)
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
