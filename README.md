# SMART DICOM Template

A starting point for building a SMART on FHIR imaging app: Cornerstone3D viewer,
SMART launch and token handling, and a place to put your algorithm.

Use it with GitHub's **Use this template**, or:

```bash
bun create github.com/proxy-smart/smart-dicom-template my-imaging-app
```

Licensed **Apache-2.0** — copy it, change it, ship it closed. That is the point of
a template, and it is deliberately not the AGPL-or-commercial licence the
[Proxy Smart](https://github.com/proxy-smart/proxy-smart) server carries.

**Every dependency comes from public npm.** `bun install` needs no registry
configuration, no token and no org membership, and the build config, ESLint config,
UI components and auth shell all live in this repository rather than in a shared
package. Change any of them without waiting on anyone.

`VITE_BASE` sets the path the app is served from (default `/`).

---

A starter kit for building SMART on FHIR imaging algorithm apps with [Proxy Smart](https://github.com/proxy-smart/proxy-smart).

## Quick Start

1. **Implement your algorithm** in [`src/algorithm.ts`](src/algorithm.ts) -- this is the only file you need to edit
2. **Register as a SMART app** in Proxy Smart's admin dashboard with client ID `smart-dicom-template`
3. **Run locally**:

```bash
bun install
bun run dev
```

The app launches at `http://localhost:5180/apps/smart-dicom-template/`.

## How It Works

```
Patient signs in via SMART on FHIR
        ↓
ImagingStudy resources fetched from FHIR server
        ↓
User selects a study
        ↓
DICOMweb image IDs loaded via Cornerstone3D
        ↓
Your runAlgorithm() called with images + FHIR context
        ↓
Result displayed in the UI
```

## Algorithm Interface

Your `runAlgorithm()` receives:

| Field | Type | Description |
|-------|------|-------------|
| `studyUID` | `string` | DICOM Study Instance UID |
| `imageIds` | `string[]` | Cornerstone3D `wadors:` image IDs |
| `imagingStudy` | `ImagingStudy` | Full FHIR ImagingStudy resource |
| `patientReference` | `string` | e.g. `"Patient/123"` |
| `accessToken` | `string \| null` | OAuth2 token for API calls |

And must return:

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Short finding title |
| `description` | `string` | Detailed description |
| `confidence` | `number?` | 0–1 confidence score |
| `code` | `object?` | SNOMED/LOINC code |
| `severity` | `string?` | `"info"`, `"warning"`, or `"critical"` |

## Example: Calling an External AI API

```typescript
export async function runAlgorithm(input: AlgorithmInput): Promise<AlgorithmResult> {
  const response = await fetch("https://your-ai-api.example.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studyUID: input.studyUID,
      imageCount: input.imageIds.length,
    }),
  })

  const data = await response.json()

  return {
    title: data.finding,
    description: data.details,
    confidence: data.score,
    severity: data.score > 0.8 ? "critical" : "info",
    code: {
      system: "http://snomed.info/sct",
      code: data.snomedCode,
      display: data.finding,
    },
  }
}
```

## Tech Stack

- **SMART on FHIR** -- OAuth2 authentication via Proxy Smart
- **DICOMweb** -- Image access via `@babelfhir-ts/dicomweb`
- **Cornerstone3D** -- DICOM image loading
- **React 19** + **TypeScript 6** + **Vite 8** + **Tailwind CSS 4**
- **Proxy Smart Shared UI** -- Consistent look and feel

## SMART App Scopes

This template requests:
- `openid` -- OpenID Connect
- `fhirUser` -- User identity
- `patient/ImagingStudy.read` -- Read imaging studies
- `patient/DiagnosticReport.write` -- Write algorithm results back

## License

Apache-2.0 — see [LICENSE](LICENSE). Built for [Proxy Smart](https://github.com/proxy-smart/proxy-smart), which is licensed separately.
