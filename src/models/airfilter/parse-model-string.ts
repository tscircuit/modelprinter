import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { airFilterModelDefinitionSchema } from "./schema"
const aliases = {
  bodywidth: "bodyWidth",
  bodydepth: "bodyDepth",
  bodyheight: "bodyHeight",
  bowldiameter: "bowlDiameter",
  bowllength: "bowlLength",
  portdiameter: "portDiameter",
  drainlength: "drainLength",
} as const
export function parseAirFilterModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "airfilter",
    airFilterModelDefinitionSchema,
    aliases,
  )
}
