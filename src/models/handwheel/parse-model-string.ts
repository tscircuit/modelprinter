import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { handwheelModelDefinitionSchema } from "./schema"
const aliases = {
  outerdiameter: "outerDiameter",
  rimwidth: "rimWidth",
  hubdiameter: "hubDiameter",
  hubheight: "hubHeight",
  borediameter: "boreDiameter",
  spokes: "spokes",
  od: "outerDiameter",
  bore: "boreDiameter",
} as const
export function parseHandwheelModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "handwheel",
    handwheelModelDefinitionSchema,
    aliases,
  )
}
