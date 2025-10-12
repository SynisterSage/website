export function setUserLoggedIn() {
  const now = Date.now()
  const expires = new Date(now + 7 * 60 * 60 * 1000).toUTCString()
  document.cookie = `userLoggedInAt=${now}; expires=${expires}; path=/`
}

export function clearUserLoggedIn() {
  document.cookie = `userLoggedInAt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
