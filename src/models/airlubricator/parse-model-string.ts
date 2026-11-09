import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { airLubricatorModelDefinitionSchema } from "./schema"
const aliases = {
  bodywidth: "bodyWidth",
  bodydepth: "bodyDepth",
  bodyheight: "bodyHeight",
  bowldiameter: "bowlDiameter",
  bowllength: "bowlLength",
  portdiameter: "portDiameter",
  filldiameter: "fillDiameter",
  fillheight: "fillHeight",
} as const
export function parseAirLubricatorModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "airlubricator",
    airLubricatorModelDefinitionSchema,
    aliases,
  )
}
