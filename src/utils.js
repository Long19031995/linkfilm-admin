/* eslint-disable no-console */
export const buildQueryString = (query) => {
  let result = []

  Object.entries(query).forEach(([key, value]) => {
    result.push(`${key}=${value}`)
  })

  return result.join('&')
}