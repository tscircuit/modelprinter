import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { pressureGaugeModelDefinitionSchema } from "./schema"

export function parsePressureGaugeModelParams(raw: RawModelprinterParams) {
  return pressureGaugeModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "pressuregauge",
      {
        od: "outerDiameter",
        depth: "caseDepth",
        steml: "stemLength",
        range: "range",
        reading: "reading",
      },
      { port: "portThread", innerport: "innerPortThread" },
      {
        backmount: ["mount", "backmount"],
        bottommount: ["mount", "bottommount"],
        psi: ["unit", "psi"],
        bar: ["unit", "bar"],
      },
    ),
  )
}
