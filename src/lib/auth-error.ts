/**
 * A one-subscriber bus for permanent auth failures.
 *
 * A fetch wrapper deep in the app is where an expired session is discovered, and the shell is
 * what has to react. Rather than thread a callback through every caller, the wrapper reports
 * here and the shell subscribes.
 */
type AuthErrorHandler = (message: string) => void

let handler: AuthErrorHandler | null = null

export function onAuthError(fn: AuthErrorHandler | null) {
  handler = fn
}

export function reportAuthError(message: string) {
  handler?.(message)
}

type AuthenticatedFetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

/**
 * Wrap an authenticated fetch so a lost session becomes a shell state rather than an unhandled
 * rejection at the call site. The error is still rethrown: the caller's own error handling is
 * not this wrapper's to swallow.
 */
export function createAuthFetch(baseFetch: AuthenticatedFetchFn): AuthenticatedFetchFn {
  return async (input, init) => {
    try {
      return await baseFetch(input, init)
    } catch (err) {
      if (err instanceof Error && /no valid smart token/i.test(err.message)) {
        reportAuthError("Your session has expired. Please sign in again.")
      }
      throw err
    }
  }
}
