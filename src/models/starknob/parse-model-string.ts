import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { starKnobModelDefinitionSchema } from "./schema"
const aliases = {
  diameter: "diameter",
  height: "height",
  borediameter: "boreDiameter",
  lobes: "lobes",
  hubdiameter: "hubDiameter",
  hubheight: "hubHeight",
  h: "height",
  d: "diameter",
  bore: "boreDiameter",
} as const
export function parseStarKnobModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "starknob",
    starKnobModelDefinitionSchema,
    aliases,
  )
}
