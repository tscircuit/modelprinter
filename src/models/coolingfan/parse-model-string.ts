import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { coolingFanModelDefinitionSchema } from "./schema"
const aliases = {
  size: "size",
  thickness: "thickness",
  hubdiameter: "hubDiameter",
  bladecount: "bladeCount",
  bladewidth: "bladeWidth",
  bladethickness: "bladeThickness",
  mountingholediameter: "mountingHoleDiameter",
  framethickness: "frameThickness",
  t: "thickness",
} as const
export function parseCoolingFanModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "coolingfan",
    coolingFanModelDefinitionSchema,
    aliases,
  )
}
