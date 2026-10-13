import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { vGrooveWheelModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  root: "rootDiameter",
  bore: "boreDiameter",
  w: "width",
  outerdiameter: "outerDiameter",
  rootdiameter: "rootDiameter",
  borediameter: "boreDiameter",
  width: "width",
} as const
export function parseVGrooveWheelModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "vgroovewheel",
    vGrooveWheelModelDefinitionSchema,
    aliases,
  )
}
