const API_URL = process.env.REACT_APP_API_URL

function handleErrors(response) {
    if (response.status !== 200) {
        throw response
    }
    return response;
}

export function listBlocks() {
    return fetch(`${API_URL}/list_blocks`)
        .then(handleErrors)
        .then((response) => response.json())
}
