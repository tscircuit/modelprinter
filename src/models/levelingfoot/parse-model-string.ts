import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { levelingFootModelDefinitionSchema } from "./schema"
const aliases = {
  basediameter: "baseDiameter",
  baseheight: "baseHeight",
  stemdiameter: "stemDiameter",
  stemlength: "stemLength",
  hexdiameter: "hexDiameter",
  hexheight: "hexHeight",
} as const
export function parseLevelingFootModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "levelingfoot",
    levelingFootModelDefinitionSchema,
    aliases,
  )
}
