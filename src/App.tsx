import { Brain } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { AlgorithmRunner } from "@/components/AlgorithmRunner"
import "./index.css"

export default function App() {
  return (
    <AppShell
      title="SMART DICOM Algorithm"
      description="Imaging analysis powered by SMART on FHIR. Sign in to run your algorithm on patient DICOM studies."
      icon={Brain}
      maxWidth="max-w-6xl"
    >
      <AlgorithmRunner />
    </AppShell>
  )
}
