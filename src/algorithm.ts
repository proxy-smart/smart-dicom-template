// The only file a template user edits: implement `runAlgorithm()`.

import type { ImagingStudy } from "fhir/r4"

export interface AlgorithmInput {
  /** DICOM Study Instance UID */
  studyUID: string

  /** Cornerstone3D `wadors:` image IDs */
  imageIds: string[]

  imagingStudy: ImagingStudy

  /** e.g. "Patient/123" */
  patientReference: string

  accessToken: string | null
}

export interface AlgorithmResult {
  title: string

  description: string

  /** 0 to 1 */
  confidence?: number

  /** e.g. SNOMED CT or LOINC */
  code?: {
    system: string
    code: string
    display: string
  }

  /** Defaults to "info" */
  severity?: "info" | "warning" | "critical"
}

export async function runAlgorithm(input: AlgorithmInput): Promise<AlgorithmResult> {
  // Replace this stub, e.g. call an AI inference API, run a WASM model, or apply DICOM metadata rules.

  console.log(`[Algorithm] Processing study ${input.studyUID} with ${input.imageIds.length} images`)

  return {
    title: "Sample Finding",
    description:
      "This is a placeholder result. Replace runAlgorithm() in src/algorithm.ts with your imaging analysis logic.",
    confidence: 0.95,
    severity: "info",
  }
}
