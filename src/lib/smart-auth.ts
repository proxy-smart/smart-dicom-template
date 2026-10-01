/**
 * The app's SMART on FHIR session.
 *
 * `SmartFhirClient` from `@babelfhir-ts/client-r4` is the whole auth layer: it owns the
 * authorize/callback/token lifecycle and hands back a typed FHIR client that carries the bearer
 * token. Both it and the FHIR types below come from public packages, so a clone of this template
 * installs with no registry configuration and no org membership.
 */
import { SmartFhirClient } from "@babelfhir-ts/client-r4"
import { config } from "@/config"

export const smart = new SmartFhirClient({
  clientId: config.clientId,
  redirectUri: config.redirectUri,
  postLogoutRedirectUri: config.postLogoutRedirectUri,
  fhirBaseUrl: config.fhirBaseUrl,
  scopes: config.scopes,
  // Namespaced so two SMART apps served from one origin cannot read each other's session.
  storagePrefix: "smart_dicom_template_",
})

export const fhirBaseUrl = config.fhirBaseUrl

/** The SMART auth manager, for callers that need the token rather than the FHIR client. */
export const smartAuth = smart.auth
