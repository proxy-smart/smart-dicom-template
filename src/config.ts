/**
 * SMART app configuration, resolved from Vite env vars.
 *
 * Deliberately local and dependency-free. This is a TEMPLATE: someone clones it, points it at
 * their own SMART deployment, and owns the result. A shared config factory would mean their app
 * silently inherits our conventions on the next release of a package they did not choose.
 *
 * Every value has an env override so nothing about a deployment is compiled in as a literal.
 * See .env.example.
 */
const isBrowser = typeof window !== "undefined"
const origin = isBrowser ? window.location.origin : ""

/** The app's own root URL, which is where a deploy under a sub-path actually lives. */
const appBase = `${origin}${import.meta.env.BASE_URL || "/"}`

/** The SMART/FHIR host this app talks to. Falls back to its own origin for a proxy-served app. */
const proxyBase = import.meta.env.VITE_PROXY_BASE ?? origin

export const config = {
  clientId: import.meta.env.VITE_CLIENT_ID ?? "smart-dicom-template",
  scopes:
    import.meta.env.VITE_SCOPES ??
    "openid fhirUser patient/ImagingStudy.read patient/DiagnosticReport.write",
  /** The redirect URI must be registered with the authorization server exactly as built here. */
  redirectUri: import.meta.env.VITE_REDIRECT_URI ?? `${appBase}callback`,
  postLogoutRedirectUri: appBase,
  fhirBaseUrl:
    import.meta.env.VITE_FHIR_BASE_URL ??
    `${proxyBase}/${import.meta.env.VITE_PROXY_PREFIX ?? "proxy-smart-backend"}/${
      import.meta.env.VITE_FHIR_SERVER_ID ?? "hapi-fhir-server"
    }/${import.meta.env.VITE_FHIR_VERSION ?? "R4"}`,
  dicomwebBaseUrl: import.meta.env.VITE_DICOMWEB_BASE_URL ?? `${proxyBase}/dicomweb`,
  /** The SMART/FHIR host itself, for callers that build their own paths under it. */
  proxyBase,
} as const
