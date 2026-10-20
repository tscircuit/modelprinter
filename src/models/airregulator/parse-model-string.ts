import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { airRegulatorModelDefinitionSchema } from "./schema"
const aliases = {
  bodywidth: "bodyWidth",
  bodydepth: "bodyDepth",
  bodyheight: "bodyHeight",
  knobdiameter: "knobDiameter",
  knobheight: "knobHeight",
  portdiameter: "portDiameter",
  gaugediameter: "gaugeDiameter",
} as const
export function parseAirRegulatorModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "airregulator",
    airRegulatorModelDefinitionSchema,
    aliases,
  )
}
