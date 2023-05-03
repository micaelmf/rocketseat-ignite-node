export function buildRoutePath(path) {
    const paramsWithParams = path.replaceAll(/:([a-zA-Z]+)/g, '(?<$1>[a-z0-9\-_]+)')
    return new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)
}