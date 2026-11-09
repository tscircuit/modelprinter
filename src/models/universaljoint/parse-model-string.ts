import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { universalJointModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  l: "length",
  bore: "boreDiameter",
  hubl: "hubLength",
  armt: "armThickness",
  crossd: "crossDiameter",
  clearance: "clearance",
  outerdiameter: "outerDiameter",
  length: "length",
  borediameter: "boreDiameter",
  hublength: "hubLength",
  armthickness: "armThickness",
  crossdiameter: "crossDiameter",
} as const
export function parseUniversalJointModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "universaljoint",
    universalJointModelDefinitionSchema,
    aliases,
  )
}
