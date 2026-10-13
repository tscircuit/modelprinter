import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { bevelGearModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  td: "topDiameter",
  h: "height",
  bore: "boreDiameter",
  depth: "toothDepth",
  hubd: "hubDiameter",
  hubh: "hubHeight",
  teeth: "teeth",
  outerdiameter: "outerDiameter",
  topdiameter: "topDiameter",
  height: "height",
  borediameter: "boreDiameter",
  toothdepth: "toothDepth",
  hubdiameter: "hubDiameter",
  hubheight: "hubHeight",
} as const
export function parseBevelGearModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "bevelgear",
    bevelGearModelDefinitionSchema,
    aliases,
  )
}
