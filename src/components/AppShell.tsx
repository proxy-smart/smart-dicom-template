import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from "react"
import { AlertTriangle, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { onAuthError } from "@/lib/auth-error"
import { smart } from "@/lib/smart-auth"

/**
 * The SMART auth state machine plus the app chrome around it.
 *
 * Local on purpose. A template is code someone takes ownership of, so the sixty lines that drive
 * sign-in are better read and edited here than inherited from a package whose next release could
 * change them. It also keeps this repo installable from public packages alone.
 *
 * ORDER MATTERS in the effect below. `isCallback()` is checked BEFORE `isAuthenticated()`: a
 * redirect back from the authorization server carries a fresh code that must be exchanged, and a
 * stale token may still be in storage from a previous session. Checking authentication first
 * would skip the exchange and run the app on the old token.
 */
type ShellState = "loading" | "callback" | "unauthenticated" | "authenticated" | "error"

export interface AppShellProps {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  /** Tailwind max-width class for the main content area. */
  maxWidth?: string
  children: ReactNode
}

export function AppShell({ title, description, icon: Icon, maxWidth = "max-w-5xl", children }: AppShellProps) {
  const [state, setState] = useState<ShellState>("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function resolveSession() {
      try {
        if (smart.isCallback()) {
          if (!cancelled) setState("callback")
          await smart.handleCallback()
          // The code is spent. Strip it so a reload cannot replay an exchanged code.
          window.history.replaceState({}, "", window.location.pathname)
          if (!cancelled) setState("authenticated")
          return
        }
        if (!cancelled) setState(smart.isAuthenticated() ? "authenticated" : "unauthenticated")
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Sign-in failed")
        setState("error")
      }
    }

    void resolveSession()
    return () => {
      cancelled = true
    }
  }, [])

  // A permanent auth failure discovered mid-session (see lib/auth-error) returns to the landing
  // screen with the reason, rather than leaving a signed-out app rendering empty data.
  useEffect(() => {
    onAuthError((message) => {
      setError(message)
      setState("unauthenticated")
    })
    return () => onAuthError(null)
  }, [])

  const login = useCallback(async () => {
    setError(null)
    try {
      await smart.authorize()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed")
      setState("error")
    }
  }, [])

  const logout = useCallback(() => void smart.logout(), [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-foreground/10 bg-foreground/[0.02]">
        <div className={`${maxWidth} mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-3`}>
          <div className="flex min-w-0 items-center gap-2">
            <Icon className="size-5 shrink-0 text-primary" />
            <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>
          </div>
          {state !== "unauthenticated" && (
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}
        </div>
      </header>

      <main className={`${maxWidth} mx-auto w-full flex-1 px-4 py-6`}>
        {state === "loading" || state === "callback" ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Spinner size="lg" />
            <p className="text-muted-foreground">
              {state === "callback" ? "Completing sign in…" : "Loading…"}
            </p>
          </div>
        ) : state === "error" ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <AlertTriangle className="size-12 text-amber-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Sign-in failed</h2>
              <p className="max-w-md text-muted-foreground">{error}</p>
            </div>
            <Button onClick={login}>Try again</Button>
          </div>
        ) : state === "unauthenticated" ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <Icon className="size-12 text-primary" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="max-w-md text-muted-foreground">{error ?? description}</p>
            </div>
            <Button size="lg" onClick={login}>
              <LogIn />
              Sign in with SMART
            </Button>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
