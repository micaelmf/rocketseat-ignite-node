export function extractQueryParams(query) {
    // return Object.fromEntries(new URLSearchParams(query))

    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=')

        queryParams[key] = value

        return queryParams
    }, {})
}