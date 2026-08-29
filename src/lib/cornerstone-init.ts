import { getAccessToken, initCornerstoneDicomweb } from "@/lib/dicomweb"

let initialized = false

export async function ensureCornerstoneInit(): Promise<void> {
  if (initialized) return

  const [core, loader] = await Promise.all([
    import("@cornerstonejs/core"),
    import("@cornerstonejs/dicom-image-loader"),
  ])

  // Both inits are synchronous in Cornerstone's shipped code, despite reading
  // like async setup; awaiting them is a no-op the type checker flags.
  core.init()
  loader.init({
    maxWebWorkers: Math.min(navigator.hardwareConcurrency || 1, 4),
  })

  // Inject OAuth bearer token into WADO-RS requests
  loader.internal.setOptions({
    beforeSend: async (xhr: XMLHttpRequest) => {
      const token = getAccessToken()
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      }
    },
  })

  // Wire up the Cornerstone DICOMweb client
  initCornerstoneDicomweb(loader)

  initialized = true
}
