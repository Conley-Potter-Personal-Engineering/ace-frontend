const TOKEN_KEY = 'ace.auth.token'

let memoryToken: string | null = null

const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false

  try {
    const testKey = '__ace_auth_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const authStorage = {
  getToken(): string | null {
    if (isStorageAvailable()) {
      const token = window.localStorage.getItem(TOKEN_KEY)
      return token && token.length > 0 ? token : null
    }

    return memoryToken
  },
  setToken(token: string): void {
    if (!token) return

    if (isStorageAvailable()) {
      window.localStorage.setItem(TOKEN_KEY, token)
      return
    }

    memoryToken = token
  },
  clearToken(): void {
    if (isStorageAvailable()) {
      window.localStorage.removeItem(TOKEN_KEY)
    }

    memoryToken = null
  },
}
