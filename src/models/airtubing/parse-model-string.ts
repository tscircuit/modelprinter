import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airTubingModelDefinitionSchema } from "./schema"

export function parseAirTubingModelParams(raw: RawModelprinterParams) {
  return airTubingModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airtubing",
      { od: "outerDiameter", id: "innerDiameter", l: "length" },
      { path: "path" },
      {},
    ),
  )
}
